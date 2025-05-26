const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');
const router = express.Router();
const { hostname } = require('os');

router.use(`/v1`, authenticate(), require('./api'));

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  
  // Use createSuccessResponse correctly to send response
  createSuccessResponse(req, res, {
    status: 'ok',
    author,
    githubUrl: 'https://github.com/mohdeep12345/fragments',
    version,
    hostname: hostname(),
  });
});

module.exports = router;
