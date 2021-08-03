var utils = require('./utils.js');
var base62 = require('./base62encode.js');

class Client {
  connected = false;
  isHost = false;
  constructor (ip, port) {
		this.ip = ip;
		this.port = port;
	}
  // Checks if one client is the same as another
  is(obj) {
    return this.ip === obj.ip && this.port === obj.port;
  }
  // Sends an error to the client
  sendError(tag, msg) {
    if (!this.connected) {
			this.open();
			this.send(utils.parseOSC(utils.SERROR, tag, msg));
			this.close();
		} else { this.send(utils.parseOSC(utils.SERROR, tag, msg)); }
  }
  // Sends a message to the client
  send(oscMsg) {
    if (!this.connected) { return; }
    console.log(oscMsg);
  }
  // Opens the server --> client connection
  open() {
    if (this.connected) { return; }
    this.isHost = true;
    this.connected = true;
  }
  // Closes the server --> client connection
  close() {
    if (!this.connected) { return; }
    this.connected = false;
  }
};

module.exports = Client;
