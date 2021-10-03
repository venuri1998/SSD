const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');

require('dotenv').config()

/*
    Creates a unique identifier, stores it in a cookie, and sends it to the user's browser
 */
passport.serializeUser((user, done) => {
    const session = {
        id: user.gooogleID,
        token: user.accessToken,
        name: user.name,
        displayPicture: user.url,
        email: user.email
    }
    done(null, session);
});

/*
    Identifying token from cookie, pass into deserializeUser function to turn it into a user
 */
passport.deserializeUser((sessionUser, done) => {
    done(null, sessionUser)
});

/*
    Requiring the keys file generated in app.js and setting Google Strategy by connecting it to your
    Google credentials and Authorized redirect URI created in the Google Developers Console.
 */
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/success'
        },
        (accessToken, refreshToken, profile, done) => {
            const session = {
                token: accessToken,
                name: profile.displayName,
                displayPicture: profile._json.picture,
                email: profile._json.email
            }
            console.log('ACCESS TOKEN - ' + accessToken)
            done(null, session);
        }
    )
);

module.exports = passport;
