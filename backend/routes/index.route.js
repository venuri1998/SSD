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
            res.json({ err: true, msg: 'user should be logged in' });
        } else {
            req.session.user = res;
        }
        next();
    });
}

// redirect uri
router.get('/redirect', setCookie, (req, res) => {
    console.log('AUTH SUCCESS ROUTE');
    res.redirect('/redirect-page');
})

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect-page', (req, res) => {
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

        googleContactService.listEvents(oauth2Client, (events) => {
            console.log(events)
            let data = {
                name: req.session.user.name,
                displayPicture: req.session.user.displayPicture,
                id: req.session.user.id,
                email: req.session.user.email,
                events: events
            }
            res.json(data)
        })

    } else {
        res.json({ err: true, msg: 'login error' })
    }
});


// add event
router.post('/add-event', (req, res) => {
    // check for valid session
    if (req.session.user) {


        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        });

        if (req.contacts) {

            const eventss = {
                'summary': 'Google I/O 2015',
                'location': '800 Howard St., San Francisco, CA 94103',
                'description': 'A chance to hear more about Google\'s developer products.',
                'start': {
                    'dateTime': '2021-09-29T09:00:00-07:00',
                    'timeZone': 'America/Los_Angeles',
                },
                'end': {
                    'dateTime': '2021-09-30T17:00:00-07:00',
                    'timeZone': 'America/Los_Angeles',
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                    { 'email': 'lpage@example.com' },
                    { 'email': 'sbrin@example.com' },
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'email', 'minutes': 24 * 60 },
                        { 'method': 'popup', 'minutes': 10 },
                    ],
                },
            }

            googleCalenderService.createEvent(oauth2Client, eventss, (response) => {
                console.log('EVENT CREATE');
                res.json(response);
            })

            res.json({ success: true, msg: 'event added successfully' })

        }

    } else {
        res.json({ err: true, msg: 'login error' })
    }
})

module.exports = router;