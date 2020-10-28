const app = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Front-end pages', function() {
  it('landing page exists', (done) => {
    chai.request(app)
      .get('/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.should.be.html;
        done();
      });
  });
});
