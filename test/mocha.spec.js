var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const request = chai.request(app);

const expect = chai.expect;

describe("Get Suite", function() {

  it("should return hello message", function() {
    request.get("/hello").end(function(err, res){
      expect(res.body.message).to.equals("Hello, Nodejs with express.");
      done();
    })
  })

})