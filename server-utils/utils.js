var base62 = require('./base62encode.js');

exports.SINFO = "/*/server/info";
exports.SERROR = "/*/server/error";

var DEFAULT = "examples/basic-osc";
var rooms = [];

// Retrieve IP addresses the server is running on
exports.getIPAddresses = function () {
  var os = require("os"),
    interfaces = os.networkInterfaces();
    print(interfaces);
    ipAddresses = [];
  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          ipAddresses.push(addressInfo.address);
      }
    }
  }
  return ipAddresses;
};

exports.parseOSC = function (address, tag, msg) {
	// Make sure the msg is an array
	if (!Array.isArray(msg)) { return; }
	// Make sure we have enough arguments
	if (tag.length - 1 !== msg.length) { return; }
	// Make the args
	let args = [];
	msg.forEach((value, i) => {
		args.push({
			type: tag[i + 1],
			value: value
		});
	});
	// Return the OSC object
	let oscMsg = {
		address: address,
		args: args
	};
	return oscMsg;
}

// Return a server code givena room code
var ip = undefined;
var makeCode = function(rid, ip) {
	// Get the IP if we dont have it yet and encode it to get the server code
	if (ip == undefined) {
		ip = base62.encode(base62.encodeIP(ip));
	}
	return ip + rid;
}

var login = function(rooms, client, undef) {
	// Make sure the client is not logged in
	if (client.isHost || undef !== undefined) {
		client.sendError(",s", ["You have already logged in"]);
		return;
	}
	// Get a room id (starts with 62 to ensure a 2-digit base62 id)
	var rid;
	for (rid = 62; rooms[base62.encode(rid)] != undefined; ++rid) {
		if (rid === 3844) {
			client.sendError(",s", ["Could not complete request: server has no more rooms avalible"]);
			return;
		}
	}
	// Open up the client's connection
	client.open();
	// Generate a room and add the client as the host of the room
	let room = new Room(rid, client);
	rooms[room.id] = room;
	client.send(exports.parseOSC(
		exports.SINFO,
		",s",
		["You have sucessfully logged in!"]
	));
}

var deploy = function(oscMsg, room) {
  // Set the world
  var world;
  if (oscMsg.args.length == 0) { room.world = DEFAULT; }
  else { room.world = oscMsg.args[0].value; }
  if (!room.world.endsWith("/")) { room.world += "/"; }
  if (!room.world.startsWith("/")) { room.world = "/" + room.world; }
  room.host.send(exports.parseOSC(
		exports.SINFO,
		",ss",
		["You world has been deployed!", `Your room code is ${makeCode(room.id)}`]
	));
}

// Check for and execute OSC commands meant for the server to interpret
exports.execServerCmd = function(rooms, oscMsg, client, room)  {
	// Client is trying to login
	if (oscMsg.address.split('/')[3] == 'login') {
		login(rooms, client, room);
		return;
	}
	// Client is not logged in but trying to execute a non-login command
	if (!client.isHost || room == undefined) {
		client.sendError(",s", ["You must be logged in to execute this command!"]);
		return;
	}
	// Client is logged in: execute proper command
	switch (oscMsg.address.split('/')[3]) {
		// Client would like to set the world they are using
		case 'deploy':
			deploy(oscMsg, room);
			break;
		case 'code':
      client.send(exports.parseOSC(
        exports.SINFO,
        ",s",
        [`${makeCode(room.id)}`]
      ));
      break;
	}
	// Command is unknown
	client.sendError(",s", "Unknown command!");
}
