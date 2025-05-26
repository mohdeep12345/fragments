const express = require('express');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { getUserFragments } = require('../../model/data');

const router = express.Router();

router.get('/fragments', async (req, res) => {
  try {
    const userId = req.user; // assuming user ID is stored here by your auth middleware
    if (!userId) {
      // If no user authenticated, return an error response
      return createErrorResponse(req, res, 401, 'Unauthorized');
    }

    const fragments = await getUserFragments(userId);

    // Use createSuccessResponse to send fragments data
    return createSuccessResponse(req, res, 200, fragments);

  } catch (err) {
    // Handle unexpected errors gracefully
    return createErrorResponse(req, res, 500, err.message || 'Server error');
  }
});

module.exports = router;
