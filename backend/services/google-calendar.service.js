const { google } = require('googleapis')

module.exports.calendarEvents = function(auth, cb) {

    const calendar = google.calendar({ version: 'v3', auth })

    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {

        if (err) {
            cb({ err: true, msg: err })
            console.log('EVENT Error')
            return
        }
        const events = res.data.items
        console.log(events)
        if (events.length) {
            cb(events)
            console.log('EVENT COUNT - ' + events.length)
        }else {
            cb([])
        }
    })
}

module.exports.createEvent = (auth, newEvent, cb) => {

    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: newEvent,
    }, (err, event) => {
        if (err) {
            cb({ err: true, msg: err })
            return
        }
        cb({ err: false, event: event })
    })
}