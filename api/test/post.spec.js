import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;

describe("Post Task", () => {

    context("given it registers a task", () => {

        let task = { title: 'Study Mongoose', owner: 'testtest@gmail.com', done: false }

        it("should return status code 200", (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body.data.title).to.be.an('string')
                    expect(res.body.data.owner).to.be.an('string')
                    expect(res.body.data.done).to.be.an('boolean')
                    done();
                })
        })
    })

    context("given it tries to register a task without title", () => {
        let task = { title: '', owner: 'testtest@gmail.com', done: false }

        it("should return status code 400", (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400)
                    expect(res.body.erros.title.message).to.eql('Oops! Title is required.')
                    done();
                })
        })
    })

    context("given it tries to register a task without owner", () => {
      let task = { title: 'Study Mongoose', owner: '', done: false }

      it("should return status code 400", (done) => {
          request
              .post('/task')
              .send(task)
              .end((err, res) => {
                  expect(res).to.has.status(400)
                  expect(res.body.erros.owner.message).to.eql('Oops! Owner is required.')
                  done();
              })
      })
  })

  context("given the task already exists", () => {
    let task = { title: 'Study Java', owner: 'testtest@gmail.com', done: false }

    it("should return status code 409", (done) => {
        request
            .post('/task')
            .send(task)
            .end((err, res) => {
                expect(res).to.has.status(409)
                expect(res.body.errmsg).to.include('duplicated key')
                done();
            })
    })
})
})
