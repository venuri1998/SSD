const { google } = require('googleapis');

module.exports.listEvents = function(auth, cb) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            cb(events)
            console.log('EVENT COUNT - ' + events.length);
        } else {
            console.log('No upcoming events found.');
        }
    });
}

module.exports.createEvent = function(auth, newEvent, cb) {

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: newEvent,
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event);
        cb(event)
    });
}