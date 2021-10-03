const { google } = require('googleapis')
const googleUtil = require('../utils/google-util')
const googleCalenderService = require('../services/google-calendar.service')
const googleContactService = require('../services/google-contact.service')
const moment = require('moment')
const nodemailer = require("nodemailer");
home = (req, res) => {
    try {
        res.render('home')
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

login = (req, res) => {
    try {
        res.redirect(googleUtil.urlGoogle())
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

redirect = (req, res) => {
    try {
        res.redirect('/redirect-page')
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

redirect_view = (req, res) => {
    try {
        res.render('redirect')
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

view = (req, res) => {
    try {

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

                    res.render('details', { contacts: contactData, calendarEvents: calendarData, moment: moment, myMail: req.session.user.email })
                })
            })
        } else {
            res.json({ err: true, msg: 'login error' })
        }
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

add_event = (req, res) => {
    try {
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

                    'attendees': [],
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
    } catch (err) {
        res.json({ err: true, msg: 'error' })
    }
}

send_mail = (req, res) => {
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2()

        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        })
        req.body.to.map((val) => {
            MailSender(val.summary, req.session.user.email, val.email)
        })

        console.log('called', req.body)
        res.status(200).redirect('/view')
    }
}

function MailSender(text, from, to) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hanger24x7@gmail.com',
            pass: '1qaz2wsx@'
        }
    });

    var mailOptions = {
        from: from,

        //change email address to your address, test it
        to: to,
        subject: 'Event Details',
        text: text
    };

    //mail sending
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { home, login, redirect, redirect_view, view, add_event, send_mail }