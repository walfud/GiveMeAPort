
class CommonPort {
  constructor() {
    this.port = null;
  }

  static get(callback) {
    let commonPort = new CommonPort();
    commonPort.port = 1234;
      callback(null, [commonPort]);
  }

  static has(port, callback) {
    callback(null, false);
  }
}

module.exports = CommonPort;
