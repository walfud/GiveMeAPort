const db = require('../utils/db');
const ReservedPort = require('./ReservedPort');
const async = require('async');
const moment = require('moment');

class Port {
    constructor() {
        this._id = null;
        this.algorithm = null;
        this.port = null;
        // this.isSystem = null;
        this.isReserved = null;
        this.timestamp = null;
    }

    static generate(url, cb) {
        async.concat(algorithm, (algorithm, callback) => {
            console.log(`${algorithm.name}<<<`);

            let port = new Port();
            port.algorithm = algorithm.name;
            port.timestamp = moment.utc().valueOf();
            algorithm(url, (err, portValue) => {
                console.log(`${algorithm.name}>>>`);

                port.port = portValue;
                async.each([/*isSystem, */isReserved], (checker, callback) => {
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
const algorithm = {
  add: (url, cb) => {
      let port = null;
      if (url) {
          port = 0;
          for (const c of url) {
              port += c.charCodeAt();
              port %= 65536;
              console.log(`${c.charCodeAt()} => ${port}`);
          }
      }
      cb(null, port);
  },

  multiple: (url, cb) => {
      let port = null;
      if (url) {
          port = 1;
          for (const c of url) {
              port *= c.charCodeAt();
              port = (port % 65535) + 1;
              console.log(`${c.charCodeAt()} => ${port}`);
          }
      }
      cb(null, port);
  },

  xor: (url, cb) => {
      let port = null;
      if (url) {
          port = 0;
          for (const c of url) {
              port ^= c.charCodeAt();
              console.log(`${c.charCodeAt()} => ${port}`);
          }
      }
      cb(null, port);
  },

  random: (url, cb) => {
      const port = Math.round(65535 * Math.random());
      console.log(port);
      cb(null, port);
  },
}


function isReserved(port, cb) {
    ReservedPort.has(port, (err, reservedPort) => {
        cb(null, reservedPort ? true : false);
    });
}

module.exports = Port;
