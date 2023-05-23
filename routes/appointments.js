const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
const base64 = require('base-64');
const moment = require('moment');

const Sentry = require('@sentry/node');

const apiUrl = process.env.ACUITY_BASE_URL;
const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;

const max = 250;
const calendarID = '1840022';

/* ===============================================================
   GET /appointments
=============================================================== */
/**
 * This request shows information about the current appointment.
 * @route GET /appointments
 * @group Appointments API - Get current appointment.
 * @returns {object} 200 - { "result": "come in, stay cool" }
 */
router.get('/', (req, res) => {
  const url = apiUrl + 'appointments?max=' + max + '&calendarID=' + calendarID;
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + base64.encode(userId + ':' + apiKey),
      'Content-Type': 'application/json',
    },
    compress: false,
  })
    .then(response => {
      Sentry.captureMessage(response);
      if (!response.ok) {
        Sentry.captureMessage(response);
        throw new Error('Network response was not okay');
      }
      return response.json();
    })
    .then((appointments) => {
      const dates = appointments.map((appointment) => {
        const rObj = {};

        const endTimeHour = appointment.endTime.toString().slice(0, 2);
        const endTimeMinute = appointment.endTime.toString().slice(3, 5);
        let endTime = new Date(appointment.datetime).setHours(endTimeHour, endTimeMinute);
        let endTimeString = new Date(endTime).toString();
        let endTimeMoment = moment(new Date(endTimeString)).format();

        let subtractMinutes = function (dt, minutes) {
          return new Date(dt.getTime() - minutes * 60000);
        };

        const shiftedTimeStart = subtractMinutes(new Date(appointment.datetime), 5).toLocaleString('de-DE', {
          timeZone: 'Europe/Berlin',
        });
        const shiftedTimeEnd = subtractMinutes(new Date(endTimeMoment), 5).toLocaleString('de-DE', {
          timeZone: 'Europe/Berlin',
        });

        rObj['firstName'] = appointment.firstName;
        rObj['lastName'] = appointment.lastName;
        rObj['timeStart'] = moment(new Date(shiftedTimeStart)).format();
        rObj['timeEnd'] = moment(new Date(shiftedTimeEnd)).format();

        return rObj;
      });

      const now = moment();

      const result = dates.find(({ timeStart, timeEnd }) => {
        const start = new Date(timeStart);
        const end = new Date(timeEnd);
        return start <= now && end > now;
      });

      if (result === undefined) {
        res
          .json({
            result: 'Hi, come in, stay cool!',
            isAppointment: false,
          })
          .status(200);
      } else {
        res
          .json({
            result: 'Hi, ' + result.firstName + ' ' + result.lastName + '!',
            isAppointment: true,
          })
          .status(200);
      }
    })
    .catch((error) => {
      Sentry.captureException(error);
      res
        .json({
          result: 'Error loading data.',
          isAppointment: false
        })
        .status(200);
    });
});

module.exports = router;
