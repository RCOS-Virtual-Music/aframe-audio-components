AFRAME.registerComponent('osc-manager', {
	schema: {
		// Bridge Server to connect to
		bridgeHost: { type: 'string', default: '127.0.0.1' },
		// OSC host and ports
		oscHost: { type: 'string', default: '127.0.0.1' },
		recievePort: { type: 'string', default: '3334' },
		sendPort: { type: 'string', default: '3333' },
		// Output line
		line: { type: 'int', default: 0 }
	},
	init: function() {
		// IO is imported in index.html
		// Make the connection to the Bridge Server
		var socket = io('http://' + this.data.bridgeHost + ':8081');
		var component = this;
		// On connection sucess
		socket.on('connect', function() {
			// Autodetect browser location
			host = location.hostname;
			if (host == 'localhost') { host = '127.0.0.1'; }
			port = location.host.split(':')[1];
			if (port < 0 || port > 65535) { port = 8000; }
			// Connect to Bridge Server
			console.log(component.data.recievePort);
			// Config the connection
			socket.emit('config',
				{
					web: {
						port: port,
						host: host
					},
					osc: {
						listen: component.data.sendPort,
						recieve: component.data.recievePort,
						host: component.data.oscHost
					}
				}
			);
			// Emit a connected message to any OSC listening
			socket.emit('message', `/connected ${host} ${port}`);
			// When we recieve an OSC message
			socket.on('message', function(obj) {
				console.log(obj);
			});
		})
	}
})
