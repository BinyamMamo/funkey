// middleware/notFoundHandler.js
const notFoundHandler = (req, res, next) => {
  console.log('404 rendered');
  return res.status(404).render('404');
  res.status(404).json({
    error: 'Resource not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404,
  });
};

module.exports = notFoundHandler;
