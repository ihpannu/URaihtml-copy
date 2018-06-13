const rpio = require("rpio");

module.exports = function (req, res) {

    rpio.open(11, rpio.OUTPUT, rpio.LOW);
    console.log('Pin 11 is currently ' + (rpio.read(11) ? 'high' : 'low'));
    for (var i = 0; i < 5; i++) {
        /* On for 1 second */
        rpio.write(11, rpio.HIGH);
        rpio.sleep(1);

        /* Off for half a second (500ms) */
        rpio.write(11, rpio.LOW);
        rpio.msleep(500);
    }

}