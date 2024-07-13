// errorHandler.js
const errorHandler = (err, req, res, next) => {
	console.error(err.stack); // Log the error stack for debugging

	const status = err.status || 500; // Default to 500 if status is not set
	const message = err.message || 'Internal Server Error';

	res.status(status).json({
			error: {
					message: message,
					status: status
			}
	});
};

module.exports = errorHandler;
