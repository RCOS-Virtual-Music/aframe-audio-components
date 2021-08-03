AFRAME.registerComponent('osc-manager', {
	dependencies: ['osc-decoder', 'osc-lookup'],
	schema: {
		// Server to connect to
		//server: { type: 'string', default: '127.0.0.1' },
		// NOTE: These variables are only intended for development or for
		// using your own custom servers
		//oscHost: { type: 'string', default: '127.0.0.1' },
		//listenPort: { type: 'string', default: '3334' },
		//sendPort: { type: 'string', default: '3333' },
	},
	init: function() {
		var component = this;
		// Make sure we have a room to connect to, otherwise STOP
		let code = AFRAME.utils.getUrlParameter('room')
		if (code === "") {
			return;
		}
		let room = code.slice(-2);
		let host = component.el.components['osc-decoder'].decode62(code.slice(0, -2));
		host = component.el.components['osc-decoder'].decodeIP(host);
		console.log("room", room);
		console.log("host", host);

		// Connect to the server
		var socket = new osc.WebSocketPort({
	    url: `ws://${host}:8081?room=${room}`, // URL to your Web Socket server.
	    metadata: true
		});
		// Receive messages
		socket.on("message", function (oscMsg) {
			let msg = component.el.components['osc-lookup'].runOSC(oscMsg);
		});
		// Open the socket
		socket.open();
		// Save the socket for later
		this.socket = socket;


		/*
		// NOTE: IO is imported in index.html
		// Make the connection to the Server
		console.log(`Attempting to connect to ${component.data.server}:8081`);
		var socket = io('http://' + host + ':8081');
		// On connection sucess
		socket.on('connect', function() {
			// Log the sucesful connection
			console.log(`Connected to ${component.data.bridgeHost}:8081`);
			// Config the connection
			socket.emit('config',
				{
					port: {
						listen: component.data.sendPort,
						recieve: component.data.listenPort,
					},
					host: component.data.oscHost
				}
			);
			// Emit a connected message to any OSC listening
			component.returnData(`${component.data.recievePort}/connected ${component.data.bridgeHost}`);
			// When we recieve an OSC message
			socket.on('message', function(message) {
				// Send the message off to the lookup component for parsing
				console.log(component.el.components.position)
				let msg = component.el.components['osc-lookup'].runOSC(message);
				component.returnData(msg);
			});

		})*/
	},
	// Function to send back data to the host OSC client
	// NOTE: This must be formated as an OSC string
	emit: function(msg) {
		if (msg == null || msg[0] !== '/') { return; }
		//socket.emit('message', msg);
	}
})
