const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const strategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secretOrKey
  },
  async (jwtPayload, done) => {
    try {
      user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = strategy;
