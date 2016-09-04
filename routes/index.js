var express = require('express');
var router = express.Router();
const Port = require('../models/Port');
const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
    const url = req.query.url;

    Port.generate(url, (err, ports) => {
      console.dir(ports);
        res.render('index', {
            defaultUrl: url,
            ports: ports,
        });
    });
});


module.exports = router;
