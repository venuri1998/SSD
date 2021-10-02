const express = require('express')
const { google } = require('googleapis')
const googleUtil = require('../utils/google-util')
const googleCalenderService = require('../services/google-calendar.service')
const googleContactService = require('../services/google-contact.service')
var moment = require('moment');
const router = express.Router()



router.get('/', (req, res) => {
    console.log('LOGIN ROUTE')
    res.render('home')
})

// redirect to authentication uri
router.get('/login', (req, res) => {
    console.log('LOGIN ROUTE')
    res.redirect(googleUtil.urlGoogle())
})

// middleware to check and save session cookie
const setCookie = async(req, res, next) => {
    console.log('SET COOKIE FUNC')
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        console.log('SET COOKIE FUNC - GET GG ACC')
        if (err) {
            res.json({ err: true, msg: 'user should be logged in' })
        } else {
            req.session.user = res
        }
        next()
    })
}

// redirect uri
router.get('/redirect', setCookie, (req, res) => {
    console.log('AUTH SUCCESS ROUTE')
    res.redirect('/redirect-page')
})

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect-page', (req, res) => {
    console.log('REDIRECT ROUTE')
    res.render('redirect')
})

// dashboard
router.get('/view', (req, res) => {
    console.log('HOME ROUTE')
        // check for valid session
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        })

        let calendarData = {}
        let contactData = []

        // get calendar events by passing oauth2 client
        googleCalenderService.calendarEvents(oauth2Client, (events) => {

            if (events) {
                calendarData = {
                    name: req.session.user.name,
                    displayPicture: req.session.user.displayPicture,
                    id: req.session.user.id,
                    email: req.session.user.email,
                    events: events
                }

            }

            googleContactService.listEvents(oauth2Client, (contacts) => {
                if (contacts) {
                    contactData = contacts
                }

                res.render('details', { contacts: contactData, calendarEvents: calendarData, moment: moment, myMail:req.session.user.email })
            })
        })
    } else {
        res.json({ err: true, msg: 'login error' })
    }
})



// add event
router.post('/add-event', (req, res) => {

    // check for valid session
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2()

        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        })

        if (req.body) {

            const event = {
                'summary': req.body.summary,
                'location': '800 Howard St., San Francisco, CA 94103',
                'description': req.body.description,
                'start': {
                    'dateTime': req.body.startDate + ':00-07:00',
                    'timeZone': 'America/Los_Angeles',
                },
                'end': {
                    'dateTime': req.body.endDate + ':00-07:00',
                    'timeZone': 'America/Los_Angeles',
                },

                'attendees': [
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'email', 'minutes': 24 * 60 },
                        { 'method': 'popup', 'minutes': 10 },
                    ],
                },
            }
            console.log(event)
            googleCalenderService.createEvent(oauth2Client, event, (response) => {
                console.log(response)
                if (response.err) res.status(400).redirect('/view')

                res.status(200).redirect('/view')
            })
        }

    } else {
        res.json({ err: true, msg: 'login error' })
    }
})

module.exports = router