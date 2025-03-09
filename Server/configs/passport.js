const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy
require('dotenv').config();

const bcrypt = require('bcrypt');

// UserAccounts Models
const UserAccountsModel = require('../models/UserAccounts');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {    
    try {
        if (!profile.id) return cb(new Error('Fail to connect with Google'), null);

        let user = await UserAccountsModel.findOne({ id_provider: profile.id, provider: 'google' });
        console.log(profile.emails?.[0]?.value);
        

        if (!user) {
            user = new UserAccountsModel({
                id_provider: profile.id,
                username: profile.displayName,
                password: null,
                fullname: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                provider: 'google', // ✅ Phân biệt provider
                avatar: profile.photos?.[0]?.value || null,
            });
            await user.save();
        }

        return cb(null, user);
    } catch (err) {
        return cb(new Error('Fail to connect with Google: ' + err.message), null);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email'], 
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        if (!profile.id) return cb(new Error('Fail to connect with Facebook'), null);

        let user = await UserAccountsModel.findOne({ id_provider: profile.id, provider: 'facebook' });

        if (!user) {
            user = new UserAccountsModel({
                id_provider: profile.id,
                username: profile.displayName,
                password: null,
                fullname: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                provider: 'facebook', // ✅ Phân biệt provider
                avatar: profile.photos?.[0]?.value || null,
            });
            await user.save();
        }

        return cb(null, user);
    } catch (err) {
        return cb(new Error('Fail to connect with Facebook: ' + err.message), null);
    }
  }
));


// Local Strategy
passport.use(new LocalStrategy(
    async function(username, password, done) {
            try {                
                let user = await UserAccountsModel.findOne({ username, provider: 'local' });
                
                if (!user) {
                    user = await UserAccountsModel.findOne({ email: username, provider: 'local' });
                    if (!user) return done(null, false)
                }
                    
                let isMatch = await bcrypt.compare(password, user.password)                

                if (!isMatch) return done(null, false)

                return done(null, user);
        } catch (error) {
            return done(new Error('Fail at Local Strategy', error), false)
        }
    }
));

module.exports = passport;
