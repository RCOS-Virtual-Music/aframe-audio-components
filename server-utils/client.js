var utils = require('./utils.js');
var base62 = require('./base62encode.js');

var clientPortOSC = 3334;

class Client {
  connected = false;
  isHost = false;
  constructor (ip, port, socket) {
		this.ip = ip;
		this.port = port;
    this.socket = socket;
	}
  // Checks if one client is the same as another
  is(obj) {
    return this.ip === obj.ip;
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
    if (oscMsg === undefined) { console.log("ERROR: Got invalid OSC"); return; }
    if (oscMsg.address == utils.SERROR || oscMsg.address == utils.SINFO) {
      console.log("From [Server] to [Host]: ", oscMsg);
    } else { console.log("From [Browser] to [Host]: ", oscMsg); }
    // Send OSC
    this.socket.send(oscMsg, this.ip, clientPortOSC);
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
