// src/routes/api/getWithId.js

module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: `GET /fragments/${req.params.id} stub response`,
  });
};
