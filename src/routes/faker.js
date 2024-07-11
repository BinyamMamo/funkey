const express = require('express');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const { hash } = require('../utils/helpers');

const fakeRoute = express.Router();

// Generate a single fake user
const generateFakeUser = async () => {
  let user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    fakeuser: true,
  };

  user.password = await hash(user.password);
  user = new User(user);
  await user.save();
  return user;
};

// Generate multiple fake users
const generateFakeUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateFakeUser());
  }
  return users;
};

// Endpoint to get a specific number of fake users
fakeRoute.get('/fake-users/:count', async (req, res) => {
  const count = parseInt(req.params.count, 10);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count parameter' });
  }

  const fakeUsers = await generateFakeUsers(count);
  res.json(fakeUsers);
});

module.exports = fakeRoute;
