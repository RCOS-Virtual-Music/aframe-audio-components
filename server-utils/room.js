var utils = require('./utils.js');
var base62 = require('./base62encode.js');

// Class to handle logged-in clients
class Room {
	// Constructor
	world = "examples/basic-osc";
	alias = "RCOS Virtual Music";
	connected = false;
	users = [];
	constructor (id, host) {
		this.id = base62.encode(id);
		this.host = host;
	}
	// Adds a user to the room
	join(user) {
		users.push(user);
		// TODO: Update the user to all past commands
	}
	// Send a plain text formatted OSC message
	broadcast (oscMsg) {
		let remove = [];
		this.users.forEach((user, i) => {
			try {
				user.socket.send(oscMsg);
			} catch (error) {
				console.log("A user has left the room");
				remove.push(i);
			}
		});
		// Remove the disconnected users
		remove.forEach((i, n) => {
			this.users.splice(i - n, 1);
		});
	}
};

module.exports = Room;
