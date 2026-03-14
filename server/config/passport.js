const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our DB
        let user = await User.findByEmail(profile.emails[0].value);

        if (!user) {
          // If not, create a new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            google_id: profile.id,
            bio: '',
            daily_goal_hours: 0
          });
        } else if (!user.google_id) {
          // If user exists but hasn't linked Google, update it
          // Note: In a real app, you might want more complex linking logic
          // user = await User.updateGoogleId(user.id, profile.id);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We are using JWT, so we don't need session serialization
// but passport might still expect these to be defined
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
