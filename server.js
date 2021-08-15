// Local requirements
var base62 = require('./server-utils/base62encode.js'),
	utils = require('./server-utils/utils.js'),
	Client = require('./server-utils/client.js');
	Room = require('./server-utils/room.js');

// Store the logged-in clients
var rooms = {};

// Module requirements
const http = require("http"),
	fs = require('fs').promises,
	osc = require('osc'),
	statik = require('node-static'),
	WebSocket = require("ws");

// We use these strings a lot
const HOSTS = utils.getIPAddresses(),
	PORT = 80;

//
var serverPort = 443,
	serverPortOSC = 3333, // osc used 57121
	index = undefined;
/*------------------------------------------------------------------------------
- HTTP SERVER ------------------------------------------------------------------
------------------------------------------------------------------------------*/

// Create a node-static server instance to serve the './public' folder
const fileServer = new statik.Server('./public');

for (let i = 0; i < HOSTS.length; i++) {
	// Start up servers on each HOST
	require('http').createServer(function (request, response) {
	    request.addListener('end', function () {
					// Split the variables and actual path
					let url = request.url.toString().split("?")[0];
					//console.log(url)
					// Serve world.html or .js files in the examples directory
					if (url.startsWith("/examples/") && (url.endsWith("world.html") || url.endsWith(".js"))) {
						fileServer.serveFile(".." + url, 200, {}, request, response);
						return;
					}
					// Serve .js files in the node-modules directory
					if (url.startsWith("/node_modules/") && url.endsWith(".js")) {
						fileServer.serveFile(".." + url, 200, {}, request, response);
						return;
					}
					// Serve component.js files in the components directory
					if (url.startsWith("/components/") && url.endsWith(".js")) {
						fileServer.serveFile(".." + url, 200, {}, request, response);
						return;
					}
					// Serve the base index file
					if (url === "/") {
						fileServer.serveFile("/../index.html", 200, {}, request, response);
						return;
					}
					// Serve anything in the public directory by default
					fileServer.serve(request, response);
	    }).resume();
	}).listen(PORT, HOSTS[i], () => {
		let url = `http://${HOSTS[i]}:${PORT}`
		// Write the index file
		fs.readFile(__dirname + "/index.html")
	    .then(contents => { index = contents; })
	    .catch(err => { console.error(`Could not read index.html file: ${err}`); }
		);
	  console.log(`HTTP server is running on ${url}`);
	});
}

/*------------------------------------------------------------------------------
- WSS SERVER -------------------------------------------------------------------
------------------------------------------------------------------------------*/

var wss = new WebSocket.Server({
  port: 8081
});

wss.on("connection", function (socket, request) {
	// Get the user
  var user = {
		socket: new osc.WebSocketPort({ socket: socket, metadata: true }),
		room: request.url.split("=")[1].slice(-2)
	}
	//console.log(socket._socket.address());
	// Ensure the room code and world are defined (login and deploy)
	if (rooms[user.room] === undefined || rooms[user.room].world === undefined) {
		// The room they asked for does not exist
		user.socket.send(utils.parseOSC(utils.SERROR, ",s", ["ERROR: bad room"]));
	} else {
		if (request.url.split("=")[0] == "/?handshake") {
			// This is a handshake: let them know the room has been verified and send them the last part of the url
			user.socket.send(utils.parseOSC(utils.SINFO, ",s", [rooms[user.room].world + "world.html"]));
		} else {
			// Add them a good ol socket
	    user.socket.on("message", function (oscMsg) {
				rooms[user.room].host.send(oscMsg);
	    });
			// Add them to their requested room
			rooms[user.room].users.push(user);
			console.log(`A browser has connected to room ${user.room}`);
		}
	}
});

/*------------------------------------------------------------------------------
- OSC SERVER -------------------------------------------------------------------
------------------------------------------------------------------------------*/

// Make the client socket
var serverOSC = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: serverPortOSC,
    metadata: true
});

// The server has started listening for client messages
serverOSC.on("ready", function () {
  console.log("Listening for OSC over UDP on the following hosts:");
	console.log(`  0) Host: 127.0.0.1, Port: ${serverOSC.options.localPort}`);
	for (var i = 0; i < HOSTS.length; i++) {
		console.log(`  ${i + 1}) Host: ${HOSTS[i]}, Port: ${serverOSC.options.localPort}`);
	}
});

// The server has recieved a OSC message from a client
serverOSC.on("message", function (oscMsg, timeTag, info) {
	if (info.family !== 'IPv4') { return; }
	let client = new Client(info.address, info.port, serverOSC);
	let isServerCmd = oscMsg.address.search(/^\/(\*|(-\d))\/server\/[a-z]*$/g) !== -1;
	// Log the message
	if (isServerCmd) { console.log("From [Host] to [Server]: ", oscMsg); }
	else { console.log("From [Host] to [Browser]: ", oscMsg); }
	// Check to see if this client is already hosting a room
	Object.keys(rooms).forEach((rid) => {
		if (client.is(rooms[rid].host)) {
			// We have the room! Pass this off as a server command or room command
			if (isServerCmd) {
				utils.execServerCmd(rooms, oscMsg, rooms[rid].host, rooms[rid])
			} else {
				rooms[rid].broadcast(oscMsg);
			}
			client = undefined;
			return;
		}
	});
	// We found a client
	if (client == undefined) { return; }
	// This is a new client: the only thing we will accept is server commands
	if (isServerCmd) {
		utils.execServerCmd(rooms, oscMsg, client, undefined);
		return;
	}
	// Client has not logged in: send error
	client.sendError(",s", ["You have not logged in yet!"]);
});

// The server has recieved an error while processing a client's message
serverOSC.on("error", function (err, timeTag, info) {
	if (info) {
		if (info.family !== 'IPv4') { console.log(err); return; }
		let client = new Client(info.address, info.port);
	}
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
