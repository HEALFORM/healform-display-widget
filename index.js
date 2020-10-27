/* ===================
   Import Environment
=================== */
require('custom-env').env(true);

/* ===================
   Import Node Modules
=================== */
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8080;
const morgan = require('morgan');
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
const Tracing = require('@sentry/tracing');
Sentry.init({
  dsn: 'https://a3843e1cf6cd4bfcb5bd7bab69acf0d1@o183412.ingest.sentry.io/5476420',
  environment: process.env.NODE_ENV,
  release: version,
  tracesSampleRate: 1.0,
});

/* ===================
   Middlewares
=================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

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
    produces: ['application/json', 'application/xml'],
    schemes: ['https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
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
app.get('*', (req, res) => {
  res.sendStatus(200);
});

/* ===================
   Start Server on Port 8080
=================== */
app.listen(port, () => {
  console.log('Listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');
});

module.exports = app;
