const { google } = require('googleapis');

require('dotenv').config()

/*
    Google app configuration
 */
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: 'http://localhost:3000/redirect'
}

/*
    Google API scopes for
        - readonly permission contacts
        - Edit permission and read permission calendar
 */
const defaultScope = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/contacts.readonly',
    'profile',
    'email'
]

/*
    Get google client
 */
function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

/*
    Generate authentication - obtain a new refresh_token
 */
function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}


/*
    get Auth URL
 */
module.exports.urlGoogle = function() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

/*
    Get Auth API
 */
function getOAuth2(auth) {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

/*
    Get Google user profile from access token
 */
module.exports.getGoogleAccountFromCode = async function(code, cb) {
    const auth = createConnection();
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const user = await getOAuth2(auth);
    user.userinfo.get((err, res) => {
        if (err) {
            cb(err);
        } else {
            const userProfile = {
                id: res.data.id,
                accessToken: tokens.access_token,
                name: res.data.name,
                displayPicture: res.data.picture,
                email: res.data.email
            }
            cb(null, userProfile);
        }
    })

}
