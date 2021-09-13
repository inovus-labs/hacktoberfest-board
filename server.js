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

app.use(express.static(path.join(__dirname, 'public')));

var userRouter = require('./routes/router');
app.use('/', userRouter);

// app.use(function (req, res, next) {
//     next(createError(404));
// });

// app.use(function (err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
app.listen(process.env.PORT | 5000);