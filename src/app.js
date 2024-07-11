const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const fakeRoute = require('./routes/faker');
const connectDB = require('./config/db');

const app = express();
// Connect to MongoDB
connectDB();

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
app.use(fakeRoute);

const PORT = 5000;
app.listen(PORT, () => {
	console.clear();
	console.log('\x1Bc'); // Clears the console (Linux only)
  console.log(`Server is running on port ${PORT}`);
});
