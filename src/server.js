const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Initialize session and passport
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  // Here you would typically save the user to your database
  // For this example, we are passing the profile to the done callback
  // Customize this part based on your user model
	console.log('profile:', profile);
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    profilePic: profile._json.picture
  };
	console.log('user:', user);
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth routes
app.get('/', (req, res) => res.send('home page'));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Profile route to show user information
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`
    <h1>${req.user.displayName}</h1>
    <p>Email: ${req.user.email}</p>
    <img src="${req.user.profilePic}" alt="Profile Picture" />
    <p><a href="/logout">Logout</a></p>
  `);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
