const bridgeConnector = require("./rademacherBridgeConnector.js");


var bridge = new bridgeConnector.Bridge("192.168.178.75","password");


bridge.connect().then(() => {
	console.log("Connected!");
	console.log("Cookie: " + bridge.cookie);
	
	bridge.getDevicesStatus().then((data) => {
		console.log(data);
		
		bridge.deviceCommand(1, {"name":"INC_CMD"}).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log("ERROR: ", err);
		});
		
	}).catch((err) => {
		console.log("ERROR: ", err);
	});
}).catch((err) => {
	console.log("ERROR: ", err);
});