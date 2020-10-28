const app = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let async = require('async');
chai.use(chaiHttp);

describe('Appointments', () => {
  describe('/GET appointments', () => {
    it('should GET all the recordings', (done) => {
      chai
        .request(app)
        .get('/appointments')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
