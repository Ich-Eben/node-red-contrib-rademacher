module.exports = function(RED) {
    function isInt(value) {
		return !isNaN(value) && 
			parseInt(Number(value)) == value && 
			!isNaN(parseInt(value, 10));
	}
	
	function rademacherRollershutterNode(config) {
        RED.nodes.createNode(this,config);
		var node = this;
		
		node.server = RED.nodes.getNode(config.server); //get connection node
		
		node.lastState = null;
		
		//Subscribe to data updates from the connection node
		node.status({fill:"yellow", shape:"ring", text:"connecting"});
		if (node.server) {
			node.server.subscribe(node);
			node.server.updateState();
		}
		
		node.on('close', function (done) {
			if (node.server) {
				node.server.unsubscribe(node);
			}
			done();
		});
		
		//new data update from the connection node
		node.onNewData = function(data) {	
			let devId = parseInt(config.device,10);
			if (isNaN(devId)) return node.status({fill:"red", shape:"ring", text:"invalid devId"});
			
			//Filter for own deviceId
			for (var device of data.devices) {
				if (device.did == devId) {
					node.status({fill:"green", shape:"dot", text: device.statusesMap.Position});
					//Send position changes to output
					if (!node.lastState || device.statusesMap.Position != node.lastState.statusesMap.Position) {
						node.send({payload: device.statusesMap.Position, completeData: device});
					}
					node.lastState = device; //store last state
				}
			}
		};
		
		//status update from the connection node
		node.onStatus = function(state, err = null) {
			if (state === "error") {
				node.status({fill:"red", shape:"ring", text: (err ? err : "error")});
			} else if (state === "ok") {
				node.status({fill:"green", shape:"dot", text: node.lastState ? node.lastState.statusesMap.Position : "OK"});
			}
		}
        
		//user input
        node.on('input', function(msg, send, done) {
			let devId = parseInt(config.device,10);
			if (isNaN(devId)) return node.status({fill:"red", shape:"ring", text:"invalid devId"});
			
			if (typeof msg.payload === "object") {
				//raw command
				node.server.rollerShutterCommand(node, devId, msg.payload);
			} else if (isInt(msg.payload)) {
				//position command
				node.server.rollerShutterCommand(node, devId, { "name":"GOTO_POS_CMD", "value":parseInt(msg.payload) });
			} else if (msg.payload === "up") {
				node.server.rollerShutterCommand(node, devId, {"name":"POS_UP_CMD"});
			} else if (msg.payload === "down") {
				node.server.rollerShutterCommand(node, devId, {"name":"POS_DOWN_CMD"});
			} else if (msg.payload === "stop") {
				node.server.rollerShutterCommand(node, devId, {"name":"STOP_CMD"});
			} else if (msg.payload === "stepup") {
				node.server.rollerShutterCommand(node, devId, {"name":"DEC_CMD"});
			} else if (msg.payload === "stepdown") {
				node.server.rollerShutterCommand(node, devId, {"name":"INC_CMD"});
			//} else if (msg.payload === "ventil") {
			//	node.server.rollerShutterCommand(node, devId, {"name":"VENTIL_CMD"});
			} else {
				node.server.rollerShutterCommand(node, devId, {"name":msg.payload});
			}
			
			done();
        });
    }
    RED.nodes.registerType("rademacher-rollershutter",rademacherRollershutterNode);
}
