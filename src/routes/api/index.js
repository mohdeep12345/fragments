/**
 * The main entry-point for the v1 version of the fragments API.
 */
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Helper stub for missing routes
const stub = (name) => (req, res) =>
  res.status(200).json({ status: 'ok', message: `${name} route stub` });

// Define routes
router.get('/fragments', require('./get') || stub('GET /fragments'));
router.post('/fragments', rawBody(), require('./post') || stub('POST /fragments'));
router.get('/fragments/:id', (() => {
  try {
    return require('./getWithId');
  } catch {
    return stub('GET /fragments/:id');
  }
})());
router.get('/fragments/:id/info', (() => {
  try {
    return require('./getInfoWithId');
  } catch {
    return stub('GET /fragments/:id/info');
  }
})());
router.get('/fragments/:id.html', (() => {
  try {
    return require('./getFragConverted');
  } catch {
    return stub('GET /fragments/:id.html');
  }
})());
router.put('/fragments/:id', rawBody(), (() => {
  try {
    return require('./put');
  } catch {
    return stub('PUT /fragments/:id');
  }
})());
router.delete('/fragments/:id', (() => {
  try {
    return require('./delete');
  } catch {
    return stub('DELETE /fragments/:id');
  }
})());

module.exports = router;
