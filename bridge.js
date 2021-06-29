// To run: node bridge.js
// make sure to install `npm install node-osc`
// and `npm install socket.io` in the directory

console.log('test');

var clientPort = 8081;

var osc = require('node-osc');
var io = require('socket.io').listen(clientPort);

// Setup the socket
io.on('connection', function(socket) {
	console.log('STARTING');
	// On config
	socket.on('config', function(obj) {
		console.log('config', obj);
		oscServer = new osc.Server(obj.server.port, obj.server.host);
		oscClient = new osc.Client(obj.client.host, obj.client.port);
		console.log('did something happen');
		oscClient.send('/status ,is', socket.id + ' running');

		oscServer.on('message', function(msg, rinfo) {
			socket.emit('message', msg);
			console.log('sent OSC message to WS', msg, rinfo);
		});
	});
	io.sockets.on('connection', function (socket) {
		var address = socket.handshake.address;
		console.log('New connection from ' + address.address + ':' + address.port);
	});
	// When the server recieves a message
	socket.on('message', function(obj) {
		var toSend = obj.split(' ');
		oscClient.send(...toSend);
		console.log('sent WS message to OSC', toSend);
	});
	// When the server disconnects
	socket.on("disconnect", function () {
		this.oscServer.kill();
	})
});