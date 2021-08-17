AFRAME.registerComponent('osc-manager', {
	dependencies: ['osc-lookup'],
	schema: {
		// Bridge Server to connect to
		bridgeHost: { type: 'string', default: '127.0.0.1' },
		// OSC host and ports
		oscHost: { type: 'string', default: '127.0.0.1' },
		recievePort: { type: 'string', default: '3334' },
		sendPort: { type: 'string', default: '3333' },
	},
	init: function() {
		var component = this;
		// IO is imported in index.html
		// Make the connection to the Bridge Server
		console.log(`Attempting to connect to ${component.data.bridgeHost}:8081`);
		var socket = io('http://' + component.data.bridgeHost + ':8081');
		// On connection sucess
		socket.on('connect', function() {
			// Log the sucesful connection
			console.log(`Connected to ${component.data.bridgeHost}:8081`);
			// Config the connection
			socket.emit('config',
				{
					port: {
						listen: component.data.sendPort,
						recieve: component.data.recievePort,
					},
					host: component.data.oscHost
				}
			);
			// Emit a connected message to any OSC listening
			socket.emit('message', `/connected ${component.data.bridgeHost} ${component.data.recievePort}`);
			// When we recieve an OSC message
			socket.on('message', function(message) {
				// Send the message off to the lookup component for parsing
				console.log(component.el.components.position)
				component.el.components['osc-lookup'].runOSC(message);
			});
		})
	}
})
