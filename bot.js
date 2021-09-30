var express = require('express');
var axios = require('axios');
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
        var username = k.substring(k.lastIndexOf("/") + 1, k.length);


        var config = {
            method: 'get',
            url: `https://api.github.com/users/${username}`,
            headers: {
                'User-Agent': 'request'
            }
        };

        axios(config)
            .then((response) => {
                var gh_data = JSON.parse(JSON.stringify(response.data))
                // console.log(gh_data);

                array.push(response.data.login, response.data.avatar_url + '.png', response.data.public_repos)
                // console.log(response.data.login, response.data.avatar_url, response.data.public_repos);
                
                var updateOptions = {
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    range: 'test!B2',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: objects
                    }
                }
            
                var res = api.spreadsheets.values.update(updateOptions)
            })
            .catch((error) => {
                console.log(error);
            });

        return array
    });

    // console.log(objects);

    // console.log(res);

    // parseData = JSON.parse(JSON.stringify(objects));
    // console.log(parseData);
}

app.listen(5000);