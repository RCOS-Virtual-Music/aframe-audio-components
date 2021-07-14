// To run: node bridge.js
// first run in this directory:
// `npm install socket.io@4`
// `npm install node-osc@6`

// NOTE:
// As of node-osc 6.0.3, npm i node-osc does not properly install
// FIX:
// `cd ./node_modules/node-osc/`
// `npm i rollup`
// `npm run-script build`
// `cd ..`
// `cd ..`

// Start
console.log('test');

var serverPort = 8081;

//import { Client, Server } from 'node-osc';
var osc = require('node-osc')

var io = require('socket.io')(serverPort, { cors:true, origins:'*'});
//io.origins('*');
//io.set('origins', '*');

// Setup the socket
io.on('connection', socket => {
	console.log('STARTING');
	// On config
	socket.on('config', function(obj) {
		console.log('New connection detected!');
		console.log('config', obj);
		// Setup an OSC connection
		this.oscServer = new osc.Server(obj.server.port, obj.server.host);
		this.oscClient = new osc.Client(obj.client.host, obj.client.port);
		// Send the connection a status update
		this.oscClient.send('/oscAddress', 200, () => {
			this.oscClient.close();
		});
		// Recieve future OSC messages and pass them onto the connected socket
		this.oscServer.on('message', function(msg) {
			socket.emit('message', msg);
			console.log('sent OSC message to Client', msg);
		});
	});
	io.sockets.on('connection', function (socket) {
		var address = socket.handshake.address;
		console.log('New connection from ' + address.address + ':' + address.port);
	});
	// When the server recieves a message
	socket.on('message', function(obj) {
		var toSend = obj.split(' ');
		this.oscClient.send(...toSend);
		console.log('sent Client message to OSC', toSend);
	});
	// When the client disconnects
	socket.on("disconnect", function () {
		this.oscClient.close();
		this.oscServer.close();
	})
});
