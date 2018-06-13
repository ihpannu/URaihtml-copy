const rpio = require("rpio");

module.exports = function (req, res) {
    rpio.open(10, rpio.OUTPUT, rpio.LOW);
    console.log('Pin 10 is currently ' + (rpio.read(10) ? 'high' : 'low'));
    for (var i = 0; i < 5; i++) {
        /* On for 1 second */
        rpio.write(10, rpio.HIGH);
        rpio.sleep(1);

        /* Off for half a second (500ms) */
        rpio.write(10, rpio.LOW);
        rpio.msleep(500);
    }

}