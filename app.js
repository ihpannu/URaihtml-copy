const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const gpio = require('rpi-gpio');
const gpiop = gpio.promise;


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
    gpio.write(7, true, function (err) {
        if (err) throw err;
        console.log('Written True to pin');
        console.log(path.join(__dirname, 'public'));
        return res.render('index', {
            status: "Cool!!Led is On"
        });
    });

});



app.post('/led/on', (req, res) => {
    gpiop.setup(11, gpio.DIR_OUT)
        .then(() => {
            return gpiop.write(11, true)
        })
        .catch((err) => {
            console.log('Error: ', err.toString())
        })
    console.log('body: ' + JSON.stringify(req.body));
    res.send(req.body)
})



// app.post('/led/on', (req, res) => {
//     gpio.setup(7, gpio.DIR_IN, readInput);
//     const obj = {
//         Status: 'Light is on'
//     }
//     console.log('body: ' + JSON.stringify(req.body));
//     res.send(req.body)
// })
// app.post('/led/off', (req, res) => {
//     res.send('Led is now off')

// })



module.exports = app;