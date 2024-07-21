const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const routes = require('./routes/routes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error_handler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
// Connect to MongoDB
connectDB();

app.use(
  session({
    secret: 'Funkey user',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.name = profile.displayName;
        user.avatar = profile._json.picture;
        await user.save();
        return done(null, user);
      }

      user = new User({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile._json.picture,
        password: '',
      });

      await user.save();
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

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
