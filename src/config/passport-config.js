require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
			try {
				const user = await User.findOne({ email: username });
				if (!user)
					return done(null, false, { message: 'No user with that email'});

				const matching = await bcrypt.compare(password, user.password);
				if (matching)
					return done(null, user);
				else
					return done(null, false, { message: 'Password incorrect'});
			} catch (err) { return done(err);}
		}
  )
);

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
