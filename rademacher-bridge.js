module.exports = function(RED) {
	'use strict'
	const bridgeConnector = require("./rademacherBridgeConnector.js");
	
    function rademacherBridgeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
		
		node.host = config.host||"192.168.178.75";
		node.interval = config.interval * 1000;
		if (node.interval < 5000) node.interval = 5000;
		node.password = node.credentials ? node.credentials.password||"password" : "password";
		
		node.rollershutterNodes = [];
		var timerInterval;
		var lastState = null;
		
		var bridge = new bridgeConnector.Bridge(node.host, node.password);
		
		getStatus();
		restartInterval();
		
		//update the device status and send it to all rademacher nodes
		function getStatus() {
			bridge.getDevicesStatus().then((data) => {
				node.rollershutterNodes.forEach( function(rollerShutterNode) {
					rollerShutterNode.onNewData(data);
				});
			}).catch((err) => {
				let e = "error";
				if (err === "Connection error") e = "connection error";
				node.rollershutterNodes.forEach( function(rollerShutterNode) {
					rollerShutterNode.onStatus("error", e);
				});
			});
		}
		
		//Restarts the stauts update interval
		function restartInterval() {
			clearTimeout(timerInterval);
			timerInterval = setInterval(getStatus,node.interval||10000);
		}
		
		//A rademacher node subscribes to status updates
		node.subscribe = function(rollershutterNode) {
			if (node.rollershutterNodes.indexOf(rollershutterNode) < 0) {
				node.rollershutterNodes.push(rollershutterNode);
			}
		};
		
		//A rademacher node unsubscribes from status updates
		node.unsubscribe = function(rollershutterNode) {
			var index = node.rollershutterNodes.indexOf(rollershutterNode);
			if (index >= 0) {
				node.rollershutterNodes.splice(index,1);
			}
		};
		
		//Execute command from rademacher node
		node.rollerShutterCommand = function(rollershutterNode, devId, command) {
			//restartInterval(); //not required status update after 10s is more then anough
			
			//use the index to access the rollershutterNode otherwise we will get errors later
			var index = node.rollershutterNodes.indexOf(rollershutterNode); 
			
			//execute command
			bridge.deviceCommand(devId, command).then((data) => {
				if (data.error_code === 0) {
					if (index >= 0) node.rollershutterNodes[index].onStatus("ok");
				} else {
					if (index >= 0) node.rollershutterNodes[index].onStatus("error", data.error_description);
				}
			}).catch((err) => {
				let e = "error";
				if (err === "Connection error") e = "connection error";
				node.error(err);
				if (index >= 0) node.rollershutterNodes[index].onStatus("error", e);
			});
		};
		
		//get a list of all devices (used for the search function)
		node.listDevices = function() {
			return new Promise((resolve, reject) => {
				bridge.getDevicesStatus().then((data) => {
					var devices = [];
					for (var device of data.devices) {
						devices.push({
							id: device.did,
							name: device.name + " - " + device.description
						});
					}
					resolve(devices);
				}).catch((err) => {
					reject(err);
				});
			});
		};
		
		//called from the rademacher nodes to update the status immediately
		node.updateState = function() {
			//getStatus(); //disabled
			//restartInterval();
		};
		
		node.on('close', function(done) {
			clearTimeout(timerInterval);
			node.rollershutterNodes = [];
			done();
		});
    }
	
	RED.nodes.registerType("rademacher-bridge",rademacherBridgeNode,{
		credentials: {
			password: {type:"password"}
		}
	});
	
	//DISCOVER DEVICES (serves devices list via HTTP)
	RED.httpAdmin.get('/rademacher/devices', function(req, res, next) {
		let configNodeId = decodeURIComponent(req.query.configNodeId);
		let config = RED.nodes.getNode(configNodeId);
		if (!config) {
			//configNode is not yet instantiated. Use host and pw directly instead
			let host = decodeURIComponent(req.query.host);
			let password = decodeURIComponent(req.query.password);
			if (!host) return res.status(500).json({error: "Host not set"});
			if (!password) password = "";
			
			//Create a new bridge cause the one form the config node does not yet exist
			var bridge = new bridgeConnector.Bridge(host, password);
			bridge.getDevicesStatus().then((data) => {
				var devices = [];
				for (var device of data.devices) {
					devices.push({
						id: device.did,
						name: device.name + " - " + device.description
					});
				}
				res.end(JSON.stringify(devices));
			}).catch((err) => {
				res.status(500).json(err);
			});
		} else {
			//use the config node instance to get the devices list. 
			//This is the prefered way to make sure we do not create a session cookie everytime		
			config.listDevices().then((devices) => {
				res.end(JSON.stringify(devices));
			}).catch((err) => {
				res.status(500).json(err);
			});
		}
	});
}




