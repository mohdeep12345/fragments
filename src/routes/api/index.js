const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// POST
router.post('/fragments', rawBody(), require('./post'));

// GET
router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./getById'));        // Route without extension
router.get('/fragments/:id.:ext', require('./getById'));   // Route with extension
router.get('/fragments/:id/info', require('./getByIdInfo'));

// DELETE
router.delete('/fragments/:id', require('./deleteById'));

// PUT
router.put('/fragments/:id', rawBody(), require('./putById'));

module.exports = router;
