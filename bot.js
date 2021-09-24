var express = require('express');
var request = require('request');
require('dotenv').config()
var app = express();

const {
    GoogleApis
} = require('googleapis');
var {
    google
} = require('googleapis')
var keys = require('./keys.json')

var parseData = {};

var client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected to Google Sheets!');
        gsrun(client);

    }
})

async function gsrun(x) {
    var api = google.sheets({
        version: 'v4',
        auth: x
    })

    var opt = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'test!B:B'
    }

    var sheetData = await api.spreadsheets.values.get(opt);
    var data = sheetData.data.values;
    // console.log(data);

    const keys = data[0];
    const val = data.slice(1);
    const objects = val.map(array => {
        var k = array[0];
        var l = k.substring(k.lastIndexOf("/") + 1, k.length);
        array.push(l)
        return array
    });

    // console.log(objects);

    var updateOptions = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'test!B2',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: objects
        }
    }

    var res = await api.spreadsheets.values.update(updateOptions)
    // console.log(res);

    // parseData = JSON.parse(JSON.stringify(objects));
    // console.log(parseData);
}











var options = {
    url: `https://api.github.com/users/{username}`,
    headers: {
        'User-Agent': 'request'
    }
};

var callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
    }
}

request(options, callback);

app.listen(5000);