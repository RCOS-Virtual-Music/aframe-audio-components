AFRAME.registerComponent('osc-manager', {
	dependencies: ['osc-lookup'],
	schema: {
		// Server to connect to
		server: { type: 'string', default: '127.0.0.1' },
		// NOTE: These variables are only intended for development or for
		// using your own custom servers
		oscHost: { type: 'string', default: '127.0.0.1' },
		listenPort: { type: 'string', default: '3334' },
		//sendPort: { type: 'string', default: '3333' },
	},
	init: function() {
		var component = this;
		// IO is imported in index.html
		// Make the connection to the Bridge Server
		console.log(`Attempting to connect to ${component.data.server}:8081`);
		var socket = io('http://' + component.data.server + ':8081');
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
		})
	},
	// Function to send back data to the host OSC client
	// NOTE: This must be formated as an OSC string
	emit: function(msg) {
		if (msg == null || msg[0] !== '/') { return; }
		socket.emit('message', msg);
	}
})
