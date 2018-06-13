const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const rpio = require('rpio')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.post('/led/on', )

app.post('/led/on', function (req, res) {
    rpio.open(11, rpio.INPUT);
    console.log('Pin 11 is currently ' + (rpio.read(11) ? 'high' : 'low'));

});


app.post('/led/off', function (req, res) {
    rpio.open(7, rpio.INPUT);
    console.log('Pin 11 is currently ' + (rpio.read(7) ? 'high' : 'low'));

});



module.exports = app;