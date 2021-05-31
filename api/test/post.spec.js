import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;
const rabbit = chai.request('http://rabbitmq:15672')

describe("Post Task", () => {

    context("given it registers a task", () => {

        let task = { title: 'Study Mongoose', owner: 'testtest@gmail.com', done: false }

        before(done => {
            rabbit
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end((err, res) => {
                    expect(res).to.has.status(204)
                    done();
                })
        })

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

        it("should send an email", (done) => { 
            let payload = { vhost: "/", name: "tasksdev", truncate: "50000", ackmode: "ack_requeue_true", encoding: "auto", count: "1" }
            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`)
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
