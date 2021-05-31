import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;

describe("Get Task", () => {

    context("given it has registered tasks", () => {

        before((done) => {
            let tasks = [
                { title: "Sleep", owner: "testtest@gmail.com", done: false },
                { title: "Study software engineering", owner: "testtest@gmail.com", done: false },
                { title: "Study test automation", owner: "testtest@gmail.com", done: true }
            ]

            tasksModel.insertMany(tasks);
            done();
        })

        it("should return a list", (done) => {
            request
                .get("/task")
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body.data).to.be.an('array')
                    done();
                })
        })

        it("should filter by keyword", (done) => {
          request
              .get("/task")
              .query({title: 'Study'})
              .end((err, res) => {
                  expect(res).to.has.status(200);
                  expect(res.body.data[0].title).to.equal('Study software engineering')
                  expect(res.body.data[1].title).to.equal('Study test automation')
                  done();
              })
        })
    })

    context("given it has a task id", () => {

          let tasks = [
              { title: "Read a book about Golang", owner: "testtest@gmail.com", done: false }
          ]

          tasksModel.insertMany(tasks, (err, result) => {
            let task_id = result[0]._id
            request
                .get("/task" + task_id)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body.data.title).to.equal(tasks[0].title)
                    done();
                })
          });
    })

    context("given the task does not exist", () => {
        let task_id = require('mongoose').Types.ObjectId();
        request
            .get("/task" + task_id)
            .end((err, res) => {
                expect(res).to.has.status(404)
                expect(res.body.data.title).to.eql({})
                done();
            })
    })
})