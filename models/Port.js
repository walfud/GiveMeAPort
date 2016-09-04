const db = require('../utils/db');
const CommonPort = require('./CommonPort');
const async = require('async');
const moment = require('moment');

class Port {
    constructor() {
        this._id = null;
        this.algorithm = null;
        this.port = null;
        this.isSystem = null;
        this.isCommon = null;
        this.timestamp = null;
    }

    static generate(url, cb) {
        async.concat([add, multiple, xor, random], (algorithm, callback) => {
            console.log(`${algorithm.name}<<<`);

            let port = new Port();
            port.algorithm = algorithm.name;
            port.timestamp = moment.utc().valueOf();
            algorithm(url, (err, portValue) => {
                console.log(`${algorithm.name}>>>`);

                port.port = portValue;
                async.each([isSystem, isCommon], (checker, callback) => {
                    checker(portValue, (err, reserved) => {
                        port[checker.name] = reserved;
                        callback();
                    });
                }, (err) => {
                    callback(err, port);
                });
            });
        }, (err, ports) => {
            cb(err, ports);
        });
    }
}

// Algorithm
function add(url, cb) {
    let port = 0;
    if (url) {
        for (const c of url) {
            port += c.charCodeAt();
            port %= 65536;
            console.log(`${c.charCodeAt()} => ${port}`);
        }
    }
    cb(null, port);
}

function multiple(url, cb) {
    let port = 1
    if (url) {
        for (const c of url) {
            port *= c.charCodeAt();
            port = (port % 65535) + 1;
            console.log(`${c.charCodeAt()} => ${port}`);
        }
    }
    cb(null, port);
}

function xor(url, cb) {
    let port = 0;
    if (url) {
        for (const c of url) {
            port ^= c.charCodeAt();
            console.log(`${c.charCodeAt()} => ${port}`);
        }
    }
    cb(null, port);
}

function random(url, cb) {
    const port = Math.round(65535 * Math.random());
    console.log(port);
    cb(null, port);
}

// Checker
function isSystem(port, cb) {
    cb(null, 0 <= port && port < 1024 ? true : false);
}

function isCommon(port, cb) {
    CommonPort.has(port, (err, commonPort) => {
        cb(null, commonPort ? true : false);
    });
}

module.exports = Port;
