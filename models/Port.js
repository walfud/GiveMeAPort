const db = require('../utils/db');
const async = require('async');

class Port {
    constructor(_id, port, algorithm, isSystem, isCommon) {
        this._id = _id;
        this.port = port;
        this.algorithm = algorithm;
        this.isSystem = isSystem;
        this.isCommon = isCommon;
    }

    static generate(url, cb) {
        if (!url) {
            cb(null, null);
        }

        async.series({
            add: (callback) => {
                console.log('add<<<');

                let port = new Port(undefined, null, 'add', false, false);
                if (url) {
                    port.port = 0;
                    for (const c of url) {
                        port.port += c.charCodeAt();
                        port.port %= 65536;
                        console.log(`${c.charCodeAt()} => ${port.port}`);
                    }
                }
                callback(null, port);

                console.log('add>>>');
            },
            multiple: (callback) => {
                console.log('multiple<<<');

                let port = new Port(undefined, null, 'multiple', false, false);
                if (url) {
                    port.port = 1;
                    for (const c of url) {
                        port.port *= c.charCodeAt();
                        port.port = (port.port % 65535) + 1;
                        console.log(`${c.charCodeAt()} => ${port.port}`);
                    }
                }
                callback(null, port);

                console.log('multiple>>>');
            },
            xor: (callback) => {
                console.log('xor<<<');

                let port = new Port(undefined, null, 'xor', false, false);
                if (url) {
                    port.port = 0;
                    for (const c of url) {
                        port.port ^= c.charCodeAt();
                        console.log(`${c.charCodeAt()} => ${port.port}`);
                    }
                }
                callback(null, port);

                console.log('xor>>>');
            },
            random: (callback) => {
                const port = Math.round(65535 * Math.random());
                callback(null, new Port(undefined, null, 'random', false, false));

                console.log(`xor<<<\n${port}xor>>>`);
            },
        }, (err, ports) => {
            cb(err, ports);
        });
    }
}

module.exports = Port;
