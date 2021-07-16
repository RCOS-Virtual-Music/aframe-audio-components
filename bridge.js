// Sockets
var serverPort = 8081;
var osc = require('node-osc')
var io = require('socket.io')(serverPort, { cors: { orgin: "*" } });

// When a Web Client connects, add them to a socket
io.on('connection', socket => {
	console.log('New connection attempted...');
	// On Web Client connection sucess (config)
	socket.on('config', function(obj) {
		// Auto detect browser IP
		let webHost = socket.conn.remoteAddress.slice(7)
		// Log the connections
		console.log(`Sucessful connection from ${webHost}:${obj.port.listen}`);
		// Connect this Web Client to the OSC Client it requests
		this.webOn = new osc.Server(obj.port.listen, webHost);
		this.oscOn = new osc.Server(obj.port.listen, obj.host);
		this.oscSend = new osc.Client(obj.host, obj.port.recieve);
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
		//this.webOn.close();
		this.oscOn.close();
	})
});
