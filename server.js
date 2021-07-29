// Ports
var serverPort = 443,
	serverPortOSC = 3333, // osc used 57121
	clientPortOSC = 9000;

// We use thiese strigns a lot
var SERROR = "/-1/server/error",
	SINFO = "/-2/server/info";

// Setup Browser <--> Server connections
var osc = require('osc');

// Store the logged-in clients
var clients = [];

// Class to handle logged-in clients
class Client {
	// Constructor
	#connected = false;
	#room = undefined;
	#client = undefined;
	constructor (address, port) {
		this.address = address;
		this.port = port;
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
			this.send(SERROR, tag, msg);
			this.close();
		}
		this.send(SERROR, tag, msg);
	}
	// Send an OSC-formatted OSC message
	sendOSC(oscMsg) {
		if (!this.#connected) { return; }
		console.log(oscMsg.args);
	}
	// Open communications between ser and server
	open (room) {
		if (this.#connected) { return; }
		// Open browser <--> client connections
		if (this.#room != undefined) {

		}
		// Open server --> client connections

		// Update state
		this.#room = room;
		this.#connected = true;
	}
	// Close communications between browser and server
	close() {
		if (!this.#connected) { return; }
		this.#room = undefined;
		this.#connected = false;
	}
	broadcast(oscMsg) {
		if (!this.#connected) { return; }

	}
};

// Check for and execute OSC commands meant for the server to interpret
var execServerCmd = function(oscMsg, client, isSaved)  {
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
		// Log the client in and add them to our records
		client.open(oscMsg.args[0].value);
		clients.push(client);
		client.send(SINFO, ",s", ["You have sucessfully logged in!"]);
		return true;
	}
	else if (address[3] === 'logout') {
		if (!isSaved) {
			client.sendError(",s", ["You have not logged in yet!"]);
			return true;
		}
		client.close();
		// Remove the client from our records
		clients.forEach((savedClient, i) => {
			if (savedClient.is(client)) { clients.splice(i, 1); }
		});
		client.send(SINFO, ",s", ["You have sucessfully logged out!"]);
		return true;
	}
	// The server command was not known
	client.sendError(",s", "Unknown command!");
	return true;
}

// Retrieve IP addresses the server is running on
var getIPAddresses = function () {
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

// Make the client socket
var serverOSC = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: serverPortOSC,
    metadata: true
});
/*
// Make the browser socket
var browserOSC = new osc.WebSocketPort({
	localAddress: "0.0.0.0",
    localPort: clientPortOSC,
    metadata: true
});

browserOSC.on("ready", function () {
	console.log('ready?');
	console.log(browserOSC);
});

browserOSC.open();
*/
// The server has started listening for client messages
serverOSC.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP on the following hosts:");
	for (var i = 0; i < ipAddresses.length; i++) {
		console.log(`  ${i + 1}) Host: ${ipAddresses[i]}, Port: ${serverOSC.options.localPort}`);
	}
});

// The server has recieved a OSC message from a client
serverOSC.on("message", function (oscMsg, timeTag, info) {
	console.log(clients);
	if (info.family !== 'IPv4') { return; }
	let client = new Client(info.address, info.port);
	// Check to see if already logged in
	clients.forEach((savedClient) => {
		if (savedClient.is(client)) {
			// Run the server command (if it is one) and if not pass it onto browsers
			if (!execServerCmd(oscMsg, savedClient, true)) { client.broadcast(oscMsg); }
			// End the loop
			client = null;
			return;
		}
	});
	if (client == null) { return; }
	// This is a new client: check to see if they are trying to log in
	if (execServerCmd(oscMsg, client, false)) { return; }
	// Client has not logged in: send login error
	client.sendError(",s", ["You have not logged in yet!"]);
});

// The server has recieved an error while processing a client's message
serverOSC.on("error", function (err, timeTag, info) {
	if (info.family !== 'IPv4') { console.log(err); return; }
	let client = new Client(info.address, info.port);
	// Fix common errors by telling the OSC client what they did wrong instead of logging locally
	if (err.message.startsWith("The header of an OSC packet didn't contain an OSC address or a #bundle string")) {
		client.sendError(",s", ["OSC address did not begin with '/'"]);
	}
	else if (err.message.startsWith("A malformed type tag string was found while reading the arguments of an OSC message")) {
		client.sendError(",s", ["OSC message tag was malformed"]);
	}
	// We don't know what the error is and should log it
	else { console.log(err); }
});

// Open the OSC server port
serverOSC.open();


/*
//Setup Server <--> Client connections
//this.webOn = new osc.Server(obj.port.listen, webHost);
var serverOSC = new osc.Server(serverPortOSC, obj.host);
var clientOSC = new osc.Client(obj.host, clientPortOSC);

// Track Client --> Server messages
serverOSC.on('message', function(msg) {
	//server.webSend.send(msg);
	console.log('sent OSC Client message to Web Client', msg);
	socket.emit('message', msg);
});


// When a Web Client connects, add them to a socket
io.on('connection', socket => {
	console.log('New connection attempted...');
	// On Web Client connection sucess (config)
	socket.on('config', function(obj) {
		// Auto detect browser IP
		let webHost = socket.conn.remoteAddress.slice(7)
		// Log the connections
		console.log(`Sucessful connection from ${webHost}:${obj.port.listen}`);

		server = this;
		// Send messages to the OSC Client
		this.webOn.on('message', function(msg) {
			socket.emit('message', msg);
			console.log('sent Web Client message to OSC Client', msg);
		});
		// Send messages to the Web Client
		this.oscOn.on('message', function(msg) {
			//server.webSend.send(msg);
			console.log('sent OSC Client message to Web Client', msg);
			socket.emit('message', msg);
		});
		// Send a start command to the Web Client
		socket.emit('message', ['/start']);
	});
	// When the Bridge recieves a message from the Web Client
	socket.on('message', function(obj) {
		var msg = obj.split(' ');
		console.log('sent Web Client message to OSC Client', msg);
		this.oscSend.send(...msg);
	});
	// When the Web Client disconnects
	socket.on("disconnect", function () {
		console.log('Web Client disconnected');
	})
});
*/
