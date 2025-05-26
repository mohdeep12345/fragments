const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./auth');
const { createErrorResponse } = require('./response');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

const app = express();

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(passport.initialize());
passport.use(authenticate.strategy());

app.use('/', require('./routes'));

// 404 handler — send error response directly, do NOT call next()
app.use((req, res) => {
  createErrorResponse(req, res, 404, 'not found');
});

// Error handling middleware — send error response directly
app.use((err, req, res, next) => {
  const status = err.error?.code || 500;
  const message = err.error?.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, 'Error processing request');
  }

  createErrorResponse(req, res, status, message);
});

module.exports = app;
