require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("currentUser", currentUser);
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
          })
            .save()
            .then((user) => {
              console.log(user);
              done(null, user);
            });
        }
      });
    }
  )
);
