const https = require('https');

const reserved = new Map();
class ReservedPort {
    constructor() {
        this.port = null;
    }

    static fetch(callback) {
        https.get('https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers', (res) => {
            if (res.statusCode === 200) {
                let data = [];
                res.on('data', (chunk) => {
                        console.log('.');
                        data.push(chunk);
                    })
                    .on('end', () => {
                        const body = data.toString();
                        const pattern = /<td>(\d+)(?:[–-\s]+(\d+))?<\/td>/g;
                        console.log('reserved<<<');
                        reserved.clear();
                        let matches;
                        while (matches = pattern.exec(body)) {
                            console.dir(`${matches[1]} - ${matches[2]}`);

                            if (!matches[2]) {
                              // Single port
                              const port = parseInt(matches[1]);
                              const reservedPort = new ReservedPort();
                              reservedPort.port = port;
                              reserved.set(port, reservedPort);
                              console.log(`+${port}`);
                            } else {
                              // Range
                              const begin = parseInt(matches[1]);
                              const end = parseInt(matches[2]) + 1;
                              for (let port = begin; port < end; port++) {
                                const reservedPort = new ReservedPort();
                                reservedPort.port = port;
                                reserved.set(port, reservedPort);
                                console.log(`++${port}`);
                              }
                            }
                        }
                        console.log('reserved>>>');
                        callback(null, reserved);
                    });
            }

            // consume response body
            res.resume();
        }).on('error', (err) => {
            callback(err);
        });
    }

    static get(callback) {
        callback(null, reserved);
    }

    static has(port, callback) {
        callback(null, reserved.has(port));
    }
}

module.exports = ReservedPort;
