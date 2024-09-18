const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const adminModel = require("../models/adminSchema");

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, done) {
        try {
            const admin = await adminModel.findOne({ email: email });
            if (!admin) {
                console.log('User not found');
                return done(null, false, { message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                console.log('Password incorrect');
                return done(null, false, { message: 'Password incorrect' });
            }
            console.log('Authentication successful');
            return done(null, admin);
        } catch (error) {
            console.error('Error during authentication:', error);
            return done(error);
        }
    }
));

passport.serializeUser((admin, done) => {
    console.log("serializeUser...", admin);
    return done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("deserializeUser...", id);
        const admin = await adminModel.findById(id);
        done(null, admin);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
