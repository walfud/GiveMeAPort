var express = require('express');
var router = express.Router();
const CommonPort = require('../models/CommonPort');

router.get('/', function(req, res, next) {
    CommonPort.get((err, commonPorts) => {
        console.dir(commonPorts);
        res.render('common', {
            commonPorts: commonPorts,
        });
    });
});


module.exports = router;
