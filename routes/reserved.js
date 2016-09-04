var express = require('express');
var router = express.Router();
const ReservedPort = require('../models/ReservedPort');

router.get('/', function(req, res, next) {
    ReservedPort.fetch((err, reservedPorts) => {
        res.render('reserved', {
            reservedPorts: [...reservedPorts.values()],
        });
    });
});


module.exports = router;
