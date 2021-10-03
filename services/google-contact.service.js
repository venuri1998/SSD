const { google } = require('googleapis');

module.exports.listEvents = function(auth, cb) {
    const service = google.people({ version: 'v1', auth });
    service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
    }, (err, res) => {
        if (err) return cb({ err: true, msg: err })
        const connections = res.data.connections;

        if (connections) {

            connectionList = []

            connections.forEach((person) => {

                if (person.names && person.emailAddresses) {
                    connectionList.push({
                        displayName: person.names[0].displayName,
                        email: person.emailAddresses[0].value
                    })
                }
            })

            cb(connectionList)
        } else {
            console.log('No connections found.');
        }
    });
}