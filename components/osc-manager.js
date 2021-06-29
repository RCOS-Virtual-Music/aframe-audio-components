AFRAME.registerComponent('osc-manager', {
	schema: {
		serverID: { type: 'string', default: '127.0.0.1' },
		serverPort: { type: 'int', default: 8000 },
		clientID: { type: 'string', default: '127.0.0.1' },
		clientPort: { type: 'int', default: 8001 },
		id: { type: 'int', default: 0 }
	},
	init: function() {
		
	}
})
