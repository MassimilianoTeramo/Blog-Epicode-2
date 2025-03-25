import GoogleStrategy from 'passport-google-oauth20';
import User from '../modelli/Users.js';
import dotenv from 'dotenv';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';

dotenv.config();


passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use (new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done)=>{
        try{
            const user = await User.findOne({ email });

            if(!user) {
                return done (null, false, {message: 'User not found'})
            }

            if (!user.password) {
                return done(null, false, { message: 'Not valid authentication' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return done(null, false, {message: 'Wrong Credentials'});
            }

            return done(null, user);
        } catch(err) {
            return done(err, false);
        }
    })
);


//Google

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_HOST + '/auth/google/callback'
}, async function (accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {

            const existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                
                existingUser.googleId = profile.id;
                await existingUser.save();
                return done(null, existingUser);
            }

            user = await User.create({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                password: await bcrypt.hash(Math.random().toString(36), 10)
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));


export default passport;

