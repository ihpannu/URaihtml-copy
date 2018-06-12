const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const gpio = require('rpi-gpio');
gpio.setup(9, gpio.DIR_OUT);
gpio.setup(10, gpio.DIR_OUT);
gpio.setup(11, gpio.DIR_OUT);

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


app.post('/led/on', function (req, res) {
    gpio.write(11, true, function (err) {
        if (err) throw err;
        console.log('Led is now on and Green');
        return res.render('index', {
            status: "Cool!!Led is On"
        });
    });

});


app.post('/led/off', function (req, res) {
    gpio.write(11, true, function (err) {
        if (err) throw err;
        console.log('Led is not off and red');
        return res.render('index', {
            status: "Ohh!! Led is Off"
        });
    });

});



module.exports = app;