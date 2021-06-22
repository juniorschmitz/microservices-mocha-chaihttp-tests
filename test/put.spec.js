import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;

describe("Put Task", () => {

    context("given it changes a task", () => {

        let task = { _id: require('mongoose').Types.ObjectId(), title: 'Buy milk', owner: 'testtest@gmail.com', done: false }

        before((done) => {
          tasksModel.insertMany([task])
          done();
        })

        it("should return status code 200", (done) => {
            task.title = 'Already bought'
            task.done = true
            request
                .put('/task/' + task._id)
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body).to.eql({})
                    done();
                })
        })

        it("should update the task data", (done) => {
          request
              .get('/task/' + task._id)
              .end((err, res) => {
                  expect(res).to.has.status(200)
                  expect(res.body.data.title).to.eql(task.title)
                  expect(res.body.data.done).to.be.true
                  done();
              })
      })
    })
})
