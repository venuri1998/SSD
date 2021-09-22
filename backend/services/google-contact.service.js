const { google } = require('googleapis');

module.exports.listEvents = function(auth) {
    const service = google.people({version: 'v1', auth});
    service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const connections = res.data.connections;
        if (connections) {
            console.log('Connections:');
            connections.forEach((person) => {
                if (person.names && person.names.length > 0) {
                    console.log(person.names[0].displayName);
                    console.log(person.emailAddresses)
                } else {
                    console.log('No display name found for connection.');
                }
            });
        } else {
            console.log('No connections found.');
        }
    });
}
