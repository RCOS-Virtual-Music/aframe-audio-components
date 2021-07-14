AFRAME.registerComponent('osc-manager', {
	schema: {
		serverHost: { type: 'string', default: '127.0.0.1' },
		serverPort: { type: 'int', default: 8000 },
		clientHost: { type: 'string', default: '127.0.0.1' },
		clientPort: { type: 'int', default: 8001 },
		id: { type: 'int', default: 0 }
	},
	init: function() {
		// Import io directly from the server
		//import io from 'http://127.0.0.1:8081/socket.io/socket.io.js'

		//var io = require('socket.io');

		fetch('http://127.0.0.1:8081/socket.io/socket.io.js')
			.then(response => response.text())
			.then(text => eval(text))
			.then(() => {
				var socket = io('http://127.0.0.1:8081');
				socket.on('connect', function() {
					// sends to socket.io server the host/port of oscServer
					// and oscClient
					socket.emit('config',
						{
							server: {
								port: this.serverPort,
								host: this.serverHost
							},
							client: {
								port: this.clientPort,
								host: this.clientHost
							}
						}
					);
				});

				socket.on('message', function(obj) {
					console.log(obj);
				});
			})
	}
})
