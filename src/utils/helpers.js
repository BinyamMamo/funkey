const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const urlFor = (endpoint) => {
	return path.join(__dirname, `../../public/${endpoint}`);
}


// Function to hash the password
const hash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const validEmail = (email) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
	urlFor,
	hash,
	validEmail,
}