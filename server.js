// Local requirements
var base62 = require('./base62.js'),
	utils = require('./utils.js'),
	Client = require('./client.js');

// Store the logged-in clients
var clients = [];
const http = require("http"),
	fs = require('fs').promises,
	osc = require('osc');

// We use thiese strigns a lot
const HOST = utils.getIPAddresses()[0],
	PORT = 80,
	CODE = base62.encode(base62.encodeIP(HOST));

//
var serverPort = 443,
	serverPortOSC = 3333, // osc used 57121
	clientPortOSC = 9000,
	index = undefined;

/*------------------------------------------------------------------------------
- HTTP SERVER ------------------------------------------------------------------
------------------------------------------------------------------------------*/

const requestListener = function (req, res) {
    // We do not want to serve the html worlds yet
    if (index == undefined) {
        res.writeHead(500);
        res.end(err);
        return;
    }
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(index);
};

const server = http.createServer(requestListener);

// Start the HTTP server for file API but nothing else
server.listen(PORT, HOST, () => {
	let url = `http://${HOST}:${PORT}`
    console.log(`HTTP server is running on ${url}`);
	console.log(`  1) ${url}/codes`)
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
    var ipAddresses = utils.getIPAddresses();
    console.log("Listening for OSC over UDP on the following hosts:");
	for (var i = 0; i < ipAddresses.length; i++) {
		console.log(`  ${i + 1}) Host: ${ipAddresses[i]}, Port: ${serverOSC.options.localPort}`);
	}
});

// The server has recieved a OSC message from a client
serverOSC.on("message", function (oscMsg, timeTag, info) {
	if (info.family !== 'IPv4') { return; }
	let client = new Client(info.address, info.port, CODE);
	// Check to see if already logged in
	clients.forEach((savedClient) => {
		if (savedClient.is(client)) {
			// Run the server command (if it is one) and if not pass it onto browsers
			if (!utils.execServerCmd(clients, oscMsg, savedClient, true)) { client.broadcast(oscMsg); }
			// End the loop
			client = null;
			return;
		}
	});
	if (client == null) { return; }
	// This is a new client: check to see if they are trying to log in
	if (utils.execServerCmd(clients, oscMsg, client, false)) { return; }
	// Client has not logged in: send login error
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
