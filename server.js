var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars');
var path = require('path');
require('dotenv').config()

var app = express();

app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

app.use(express.static(__dirname, + 'public'));

var userRouter = require('./routes/router');
app.use('/', userRouter);

// module.exports = app;
app.listen(5000);