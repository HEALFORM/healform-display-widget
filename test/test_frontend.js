const app = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Front-end pages', function() {
  it('landing page exists', function () {
    chai.request(app)
      .get('/')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});
