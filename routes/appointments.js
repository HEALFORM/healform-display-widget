const express = require('express');
const router = express.Router();
const axios = require('axios');
const base64 = require('base-64');
const moment = require('moment');
const Sentry = require('@sentry/node');

const apiUrl = process.env.ACUITY_BASE_URL;
const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;
const max = 100;
const calendarID = '1840022';

// Create axios instance with timeout and headers
const createAxiosInstance = () => {
  return axios.create({
    baseURL: apiUrl,
    timeout: 20000, // 20 seconds timeout
    headers: {
      Authorization: 'Basic ' + base64.encode(userId + ':' + apiKey),
      'Content-Type': 'application/json',
    },
  });
};

// Function to subtract minutes from a date
const subtractMinutes = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60000);
};

// Function to format appointment data
const formatAppointment = (appointment) => {
  const endTimeHour = appointment.endTime.slice(0, 2);
  const endTimeMinute = appointment.endTime.slice(3, 5);
  const endTime = new Date(appointment.datetime).setHours(endTimeHour, endTimeMinute);

  const shiftedTimeStart = subtractMinutes(new Date(appointment.datetime), 5);
  const shiftedTimeEnd = subtractMinutes(new Date(endTime), 5);

  return {
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    timeStart: moment(shiftedTimeStart).format(),
    timeEnd: moment(shiftedTimeEnd).format(),
  };
};

/* ===============================================================
   GET /appointments
=============================================================== */
/**
 * This request shows information about the current appointment.
 * @route GET /appointments
 * @group Appointments API - Get current appointment.
 * @returns {object} 200 - { "result": "come in, stay cool" }
 */

router.get('/', async (req, res) => {
  const url = `appointments?max=${max}&calendarID=${calendarID}&minDate=${moment().format('YYYY-MM-DD')}&direction=asc`;

  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(url);

    const appointments = response.data;
    const formattedDates = appointments.map(formatAppointment);

    const now = moment();
    const currentAppointment = formattedDates.find(({ timeStart, timeEnd }) => {
      const start = new Date(timeStart);
      const end = new Date(timeEnd);
      return start <= now && end > now;
    });

    if (currentAppointment) {
      res.status(200).json({
        result: `Hi, ${currentAppointment.firstName} ${currentAppointment.lastName}!`,
        isAppointment: true,
      });
    } else {
      res.status(200).json({
        result: 'Hi, come in, stay cool!',
        isAppointment: false,
      });
    }
  } catch (error) {
    // Capture the error in Sentry and send a response with an error message
    Sentry.captureException(error);

    let errorMessage = 'Error loading data.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error.code === 'ECONNRESET') {
      errorMessage = 'Connection was reset. Please try again.';
    } else if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
    }

    res.status(500).json({
      result: errorMessage,
      isAppointment: false,
    });
  }
});

module.exports = router;
