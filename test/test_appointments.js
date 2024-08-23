const app = require('../index'); // Ensure this path points to your main app file
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const moment = require('moment');
const should = chai.should();

chai.use(chaiHttp);

describe('Appointments API', () => {
  const apiUrl = 'https://acuityscheduling.com/api/v1';
  const calendarID = 1840022;
  const max = 100;
  const minDate = moment().format('YYYY-MM-DD');

  beforeEach(() => {
    // This runs before each test and ensures no lingering mocks affect subsequent tests
    nock.cleanAll();
  });

  afterEach(() => {
    // Clean up after each test to ensure proper test isolation
    nock.cleanAll();
  });

  describe('GET /appointments', () => {
    it('should GET all the appointments successfully', (done) => {
      // Mock the API request to Acuity Scheduling
      nock(apiUrl)
        .get('/appointments')
        .query({
          max: max.toString(),
          calendarID: calendarID.toString(),
          minDate: minDate,
          direction: 'asc',
        })
        .reply(200, [
          {
            firstName: 'John',
            lastName: 'Doe',
            datetime: '2024-08-21T10:00:00',
            endTime: '11:00',
          },
        ]);

      chai
        .request(app)
        .get('/appointments')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('result').that.is.a('string');
          res.body.should.have.property('isAppointment').that.is.a('boolean');
          done();
        });
    });

    it('should handle request timeout gracefully', (done) => {
      // Simulate a timeout error
      nock(apiUrl)
        .get('/appointments')
        .query({
          max: max.toString(),
          calendarID: calendarID.toString(),
          minDate: minDate,
          direction: 'asc',
        })
        .delay(21000) // Delay the response for longer than the timeout
        .reply(200); // Still reply with status 200 but delayed

      chai
        .request(app)
        .get('/appointments')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('result').that.equals('Request timed out. Please try again.');
          res.body.should.have.property('isAppointment').that.equals(false);
          done();
        });
    });

    it('should handle server errors gracefully', (done) => {
      // Mock a server error response from Acuity Scheduling
      nock(apiUrl)
        .get('/appointments')
        .query({
          max: max.toString(),
          calendarID: calendarID.toString(),
          minDate: minDate,
          direction: 'asc',
        })
        .reply(500, { message: 'Internal Server Error' });

      chai
        .request(app)
        .get('/appointments')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('result').that.is.a('string').and.contains('Error');
          res.body.should.have.property('isAppointment').that.equals(false);
          done();
        });
    });

    it('should handle ECONNRESET error gracefully', (done) => {
      // Mock an ECONNRESET error
      nock(apiUrl)
        .get('/appointments')
        .query({
          max: max.toString(),
          calendarID: calendarID.toString(),
          minDate: minDate,
          direction: 'asc',
        })
        .replyWithError({
          message: 'ECONNRESET',
          code: 'ECONNRESET',
        });

      chai
        .request(app)
        .get('/appointments')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('result').that.equals('Connection was reset. Please try again.');
          res.body.should.have.property('isAppointment').that.equals(false);
          done();
        });
    });
  });
});
