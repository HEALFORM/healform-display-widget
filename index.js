require("custom-env").env(true);
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Validate required environment variables
const requiredEnv = ["HOST", "PORT", "NODE_ENV", "SENTRY_DSN"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is missing`);
  }
});

const app = express();
const port = process.env.PORT || 8080;
const { version } = require("./package.json");
const appointments = require("./routes/appointments");

// Sentry initialization for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: version,
});

// Middlewares
app.use(helmet()); // Adds security headers
app.use(cors({ origin: "https://display-widget.healform.de/" })); // Replace with your actual domain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up Swagger API Docs
const expressSwagger = require("express-swagger-generator")(app);
let options = {
  swaggerDefinition: {
    info: {
      description: "Real-time HEALFORM appointments via Acuity Scheduling API.",
      title: "HEALFORM Display Widget",
      version: version,
    },
    host: process.env.HOST,
    basePath: "",
    produces: ["application/json"],
    schemes: ["http", "https"],
  },
  basedir: __dirname,
  files: ["./routes/**/*.js"],
};
expressSwagger(options);

// Pug views setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.use("/appointments", appointments);

// Render base page
app.get("/", (req, res) => {
  res.render("index");
});

// Start Server
const server = http.createServer(app);
const io = socketIo(server);

const getAppointment = async (socket) => {
  try {
    const res = await axios.get(
      `http://${process.env.HOST}:${process.env.PORT}/appointments`,
    );
    socket.emit("currentAppointment", res.data);
  } catch (error) {
    Sentry.captureException(error);
    socket.emit("currentAppointment", {
      result: "Error fetching appointment data",
      isAppointment: false,
    });
  }
};

// Socket.io connection handling
io.on("connection", (socket) => {
  getAppointment(socket);
  const interval = setInterval(() => getAppointment(socket), 30000);

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

// Start listening on the defined port
server.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
