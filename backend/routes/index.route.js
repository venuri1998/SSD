const express = require('express');
const { google } = require('googleapis');
const googleUtil = require('../utils/google-util');
const googleCalenderService = require('../services/google-calendar.service');
const googleContactService = require('../services/google-contact.service')

const router = express.Router();

// redirect to authentication uri
router.get('/login', (req, res) => {
    console.log('LOGIN ROUTE');
    res.redirect(googleUtil.urlGoogle());
});

// middleware to check and save session cookie
const setCookie = async(req, res, next) => {
    console.log('SET COOKIE FUNC');
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        console.log('SET COOKIE FUNC - GET GG ACC');
        if (err) {
            res.redirect('/login');
        } else {
            req.session.user = res;
        }
        next();
    });
}

// redirect uri
router.get('/auth/success', setCookie, (req, res) => {
    console.log('AUTH SUCCESS ROUTE');
    res.redirect('/redirect');
})

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect', (req, res) => {
    console.log('REDIRECT ROUTE');
    res.render('redirect.html');
});

// dashboard
router.get('/home', (req, res) => {
    console.log('HOME ROUTE');
    // check for valid session
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        });

        googleCalenderService.createEvent(oauth2Client, (response) => {
            console.log('EVENT CREATE');
            res.json(response);
        });

        googleContactService.listEvents(oauth2Client)

    } else {
        res.redirect('/login')
    }
});

module.exports = router;
