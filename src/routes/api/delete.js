const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    
    if (!fragment) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    await Fragment.delete(req.user, req.params.id);
    
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};