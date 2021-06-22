import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;

describe("Delete Task", () => {

    context("given the task is deleted", () => {

        let task = { _id: require('mongoose').Types.ObjectId(), title: 'Pay for internet bills', owner: 'testtest@gmail.com', done: false }

        before((done) => {
          tasksModel.insertMany([task])
          done();
        })

        it("should return status code 200", (done) => {
            request
                .delete('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body).to.eql({})
                    done();
                })
        })

        after((done) => {
          request
              .get('/task/' + task._id)
              .end((err, res) => {
                  expect(res).to.has.status(404)
                  expect(res.body.data.title).to.eql(task.title)
                  done();
              })
        })
    })

    context("when the task does not exist", () => {
        it("should return status code 404", (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
            .delete('/task/' + id)
            .end((err, res) => {
                expect(res).to.has.status(404)
                expect(res.body).to.eql({})
                done();
            })
        })
    })
})
