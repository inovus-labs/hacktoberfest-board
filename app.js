var express = require('express');
var hbs = require('express-handlebars');
require('dotenv').config()

const { GoogleApis } = require('googleapis');
var { google } = require('googleapis')
var keys = require('./keys.json')

var parseData = {};

var client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    
    client.authorize( (err, tokens) => {
        if(err) {
            console.log(err);
            return;
        } else {
            console.log('Connected to Google Sheets!');
            gsrun(client);
            
        }
    })
    
    async function gsrun(x){
        var api = google.sheets({
        version: 'v4',
        auth: x
    })
    
    var opt = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'test!A:E'
    }
    
    var sheetData = await api.spreadsheets.values.get(opt);
    var data = sheetData.data.values;
    // console.log(data);

    const keys = data[0];
    const values = data.slice(1);
    const objects = values.map(array => {
        const object = {};
        keys.forEach((key, i) => object[key] = array[i]);
        return object;
    });
    
    parseData = JSON.parse(JSON.stringify(objects));
    // console.log(parseData);
}

var app = express();
app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

app.use(express.static(__dirname, +'public'));

app.get('/', (req, res) => {
    // console.log(parseData)
    res.render('home', {parseData});
});

app.listen(3000);