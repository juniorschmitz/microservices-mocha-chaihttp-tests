import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request(app);

const expect = chai.expect;

describe("Get Suite", function() {

  it("should return hello message", (done) => {
    request
        .get("/hello")
        .end((err, res) => {
            expect(res.body.message).to.equals("Hello, Nodejs with express.");
            done();
    })
  })

})