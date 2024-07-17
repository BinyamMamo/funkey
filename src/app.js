const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/routes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error_handler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
// Connect to MongoDB
connectDB();

app.use(session({
	secret: 'Funkey user',
	resave: false,
	saveUninitialized: false,
}));

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set the directory for your views
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));	

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(routes);

// Example route that throws an error
app.get('/error', (req, res) => {
	throw new Error('This is a test error');
});

// Add the not found handler middleware after all routes
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
	console.clear();
	console.log('\x1Bc'); // Clears the console (Linux only)
  console.log(`Server is running on port ${PORT}`);
});
