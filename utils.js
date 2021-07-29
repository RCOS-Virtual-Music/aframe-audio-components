var base62 = require('./base62.js');

const SINFO = "/-2/server/info";
const SERROR = "/-1/server/error";

var rooms = [];

// Check for and execute OSC commands meant for the server to interpret
exports.execServerCmd = function(clients, oscMsg, client, isSaved)  {
	// Make sure this is a valid server command
	let address = oscMsg.address.split('/');
	if (address[2] !== 'server') { return false; }
	if (oscMsg.address.search(/^\/(\*|(-\d))\/server\/[a-z]*$/g) === -1) {
		client.sendError(",s", ["Invalid server command!"]);
		return true;
	}

	// Check through all known server commands
	if (address[3] === 'login') {
		if (isSaved) {
			client.sendError(",s", ["You have already logged in!"]);
			return true;
		}
		if (oscMsg.args.length !== 1) {
			client.sendError(",s", ["invalid login command: expected a room name"]);
			return true;
		}
        // Get a room number
        let r = 0;
        while (rooms.indexOf(r) != -1) { ++r; }
        rooms.push(r);
		// Log the client in and add them to our records
		client.open(oscMsg.args[0].value, r);
		clients.push(client);
		client.send(SINFO, ",s", ["You have sucessfully logged in!"]);
		return true;
	}
    else if (!isSaved) {
        client.sendError(",s", ["You have not logged in yet!"]);
        return true;
    }
	else if (address[3] === 'logout') {
		client.close();
		// Remove the client from our records
		clients.forEach((savedClient, i) => {
			if (savedClient.is(client)) { clients.splice(i, 1); }
		});
		client.send(SINFO, ",s", ["You have sucessfully logged out!"]);
		return true;
	}
    else if (address[3] === 'deploy') {
        console.log(address[3]);
        if (oscMsg.args.length !== 1) {
			client.sendError(",s", ["Invalid login command: expected a world name"]);
			return true;
		}
        if (client.isDeployed()) {
            client.sendError(",s", ["A world has already been deployed"]);
			return true;
        }
        if (client.deploy(oscMsg.args[0].value)) {
            client.send(SINFO, ",ss", ["Deployment sucessful!", `Your room code is ${client.code()}`]);
            return true;
        }
        client.sendError(",s", ["Deployment failed"]);

		return true;
	}
	// The server command was not known
	client.sendError(",s", "Unknown command!");
	return true;
}

// Retrieve IP addresses the server is running on
exports.getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];
    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }
    return ipAddresses;
};
