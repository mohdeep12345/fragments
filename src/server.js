// src/server.js

// Check if the environment variable LOG_LEVEL is set to 'debug'
if (process.env.LOG_LEVEL === 'debug') {
  console.log('Environment Variables:');
  console.log(process.env); // Print all environment variables
}

// Your existing server setup...
const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');

const port = parseInt(process.env.PORT || '8080', 10);

const server = stoppable(
  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  })
);

module.exports = server;
