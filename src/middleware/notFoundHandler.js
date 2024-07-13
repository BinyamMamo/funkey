// middleware/notFoundHandler.js
const notFoundHandler = (req, res, next) => {
	res.status(404).json({
					error: 'Resource not found',
					message: `Cannot ${req.method} ${req.originalUrl}`,
					status: 404
			}
	);
};

module.exports = notFoundHandler;
