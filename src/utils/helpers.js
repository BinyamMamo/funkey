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

module.exports = {
	urlFor,
	hash,
}