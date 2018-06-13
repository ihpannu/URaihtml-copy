const rpio = require("rpio");

module.exports = function (req, res) {
    if (req.body.hasOwnProperty("action")) {
        if (req.body.action === "write") {
            rpio.init({
                mapping: "gpio"
            });
            rpio.open(req.body.gpio, rpio.OUTPUT, +req.body.status);
            rpio.write(rpio.body.gpio, +req.body.status);
            res.contentType("json");
            rpio.send({
                gpio: req.body.gpio,
                status: req.body.status
            });
        }
    }
};