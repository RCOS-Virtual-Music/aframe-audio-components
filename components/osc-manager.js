AFRAME.registerComponent('osc-manager', {
	schema: {
		// Bridge Server to connect to
		bridgeHost: { type: 'string', default: '127.0.0.1' },
		// OSC host and ports
		oscHost: { type: 'string', default: '127.0.0.1' },
		recievePort: { type: 'string', default: '3334' },
		sendPort: { type: 'string', default: '3333' },
		// Output line for internal broadcasting
		line: { type: 'int', default: 0 }
	},
	init: function() {
		// IO is imported in index.html
		// Make the connection to the Bridge Server
		console.log(`Attempting to connect to ${this.data.bridgeHost}:8081`);
		var socket = io('http://' + this.data.bridgeHost + ':8081');
		var component = this;
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
			socket.on('message', function(obj) {
				// Log the message
				console.log(obj);
			});
		})
	}
})
