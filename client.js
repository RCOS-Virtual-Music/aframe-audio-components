var utils = require('./utils.js');
var base62 = require('./base62.js');

// Class to handle logged-in clients
class Client {
	// Constructor
	#connected = false;
    #client = undefined;
	#rid = undefined;
    #code = undefined;
    #world = undefined;
    rname = undefined;
	constructor (address, port, code) {
		this.address = address;
		this.port = port;
        this.#code = code;
	}
    isDeployed() { return this.#world != undefined; }
    code() { return this.#code + base62.encode(this.#rid); }
    deploy(world) {
        this.#world = world;
        return true;
    }
	// Check if two clients are the same
	is (obj) { return obj.address == this.address && obj.port == this.port; }
	// Send a plain text formatted OSC message
	send (address, tag, msg) {
		if (!Array.isArray(msg)) { return; }
		// Make sure we have enough arguments
		if (tag.length - 1 !== msg.length) { return; }
		// Make the args
		let args = [];
		msg.forEach((value, i) => {
			args.push({
				type: tag[i + 1],
				value: value
			});
		});
		// Send the OSC object
		this.sendOSC({
			address: address,
			args: args
		});
	}
	sendError (tag, msg) {
		if (!this.#connected) {
			this.open(undefined);
			this.send(utils.SERROR, tag, msg);
			this.close();
		}
		this.send(utils.SERROR, tag, msg);
	}
	// Send an OSC-formatted OSC message
	sendOSC(oscMsg) {
		if (!this.#connected) { return; }
		console.log(oscMsg.args);
	}
	// Open communications between client and server/server and browser
	open (rname, rid) {
		if (this.#connected) { return; }
        this.#rid = rid;
        this.rname = rname;
        // Open browser <--> server connections


		// Open server --> client connections

		// Update state
		this.#connected = true;
	}
	// Close communications between browser and server
	close() {
		if (!this.#connected) { return; }
		this.#connected = false;
	}
	broadcast(oscMsg) {
		if (!this.#connected) { return; }

	}
};

module.exports = Client;
