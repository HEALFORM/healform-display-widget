/* ===================
   Import Environment
=================== */
require('custom-env').env(true);

/* ===================
   Import Node Modules
=================== */
const express = require('express');
const axios = require('axios');
const app = express();
const router = express.Router();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8080;
const { version } = require('./package.json');
require('dotenv').config();

/* ===================
   Import routes
=================== */
const appointments = require('./routes/appointments'); // Import Appointments Routes

/* ===================
   Error Tracking
=================== */
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: "https://13ebfe98c5e4426f82da1eac5f514cf3@o685353.ingest.sentry.io/5772325",
  environment: process.env.NODE_ENV,
  release: version,
});

/* ===================
   Middlewares
=================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================
   Swagger API Docs
=================== */
const expressSwagger = require('express-swagger-generator')(app);
let options = {
  swaggerDefinition: {
    info: {
      description:
        'This server provides real-time information about current HEALFORM appointments scheduled through the Acuity Scheduling API.',
      title: 'HEALFORM Display Widget',
      version: version,
    },
    host: process.env.HOST,
    basePath: '',
    produces: ['application/json'],
    schemes: ['http', 'https'],
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'], //Path to the API handle folder
};
expressSwagger(options);

/* ===================
   Routes
=================== */
app.use('/appointments', appointments);

/* ===================
   Render base pages
=================== */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

/* ===================
   Start Server on Port 8080
=================== */
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  getAppointment(socket);
  setInterval(() => getAppointment(socket), 30000);
});

server.listen(port, () => {
  console.log('Listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');
});

/* ===================
   Get current appointment
=================== */
const getAppointment = async (socket) => {
  try {
    const res = await axios.get('http://' + process.env.HOST + ':' + process.env.PORT + '/appointments');
    socket.emit('currentAppointment', res.data);
  } catch (error) {
    Sentry.captureException(error);
    socket.emit('currentAppointment', error);
  }
};

module.exports = app;
