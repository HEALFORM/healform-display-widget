const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
const base64 = require('base-64');

const apiUrl = process.env.ACUITY_BASE_URL;
const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;

const max = 1;
const calendarID = '1840022';
const minDate = new Date().toISOString();
const maxDate = new Date().toISOString();

/* ===============================================================
   GET /appointments
=============================================================== */
/**
 * This function comment is parsed by doctrine
 * @route GET /appointments
 * @group Appointments API - Manage audio recordings.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/', (req, res) => {
  console.log(minDate);
  const url =
    apiUrl + 'appointments?max=' + max + '&calendarID=' + calendarID + '&minDate=' + minDate + '&maxDate=' + maxDate;
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + base64.encode(userId + ':' + apiKey),
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((appointments) => {
      console.log(appointments)
      if (appointments.length === 0) {
        res.json({ appointment: 'Es wurde kein aktueller Termin gefunden.' });
      } else {
        res.json({ appointment: appointments });
      }
    })
    .catch((error) => {
      throw error;
    });
});

module.exports = router;
