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
		if (code === "") { window.location.reload() }
		let room = code.slice(-2);
		let host = component.el.components['osc-decoder'].decode62(code.slice(0, -2));
		host = component.el.components['osc-decoder'].decodeIP(host);
		console.log(`room ${room} (${component.el.components['osc-decoder'].decode62(room)})`);
		console.log("host", host);
		// Connect to the server
		var socket = new osc.WebSocketPort({
	    url: `ws://${host}:8081?room=${room}`, // URL to your Web Socket server.
	    metadata: true
		});
		// Receive messages
		socket.on("message", function (oscMsg) {
			if (oscMsg.address === "/*/server/error") {
				window.location.reload();
				return;
			}
			//let oscHear = component.el.components['osc-lookup'].parse('/*/rotation/x/set', ',f', 12.1);
			let oscResponse = component.el.components['osc-lookup'].runOSC(oscMsg);
		});
		// Reload on error
		socket.on("error", function (error) {
		  console.log("ERROR:", error);
			//window.location.reload()
		});
		// Log the connection
		socket.on("ready", function (error) {
		  console.log(`Connected to ${host} at room ${room}`);
		});
		// Save the socket for later
		this.socket = socket;
		// Open the socket
		socket.open();
	},
	// Function to send back data to the host OSC client
	// NOTE: This must be formated as an OSC string
	send: function(oscMsg) {
		this.socket.send(oscMsg);
	}
})
