const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// const rpio = require('rpio')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ledgreen = require('./routes/ledgreen')
const ledoff = require('./routes/ledoff')

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


app.post('/led/green', ledgreen);
app.post('/led/off', ledoff);



module.exports = app;