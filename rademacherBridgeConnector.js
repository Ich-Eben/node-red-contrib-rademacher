const crypto = require("crypto-js");
const request = require('request');

//login and get a sission cookie
getSessionCookie = function(host, password) {
	return new Promise((resolve, reject) => {
		if (!host) return reject("Invalid Host");
	
		//Get password salt (could we also just use a self generated salt?)
		request({
			method: "POST",
			json: true,
			uri: "http://" + host + "/authentication/password_salt",
			timeout: 5000
		}, (err, res, data) => {
			if (err) return reject(err);
			if (!res || res.statusCode != 200) return reject({statusCode: res ? res.statusCode : 0, error: data});
			
			let salt = data.password_salt;
			let pwHash = crypto.SHA256(password).toString(crypto.enc.hex);
			//Salt PW
			let saltedPW = crypto.SHA256(salt + pwHash).toString(crypto.enc.hex);
			
			//Request a cookie
			request({
				method: "POST",
				json: {
					password: saltedPW,
					password_salt: salt
				},
				uri: "http://" + host + "/authentication/login",
				timeout: 5000,
				headers: [
					{ "Content-Type": "application/json" }
				]
			}, (err, res, data) => {
				if (err) return reject(err);
				if (res.statusCode != 200) reject({statusCode: res.statusCode, error: data});
				if (!res.headers["set-cookie"]) return reject("No cookie set");
				
				resolve(res.headers["set-cookie"]);
			});
		});
	});
};


Bridge = class {
	
	constructor(host, password) {
		this.host = host;
		this.password = password ? password : "";
		this.cookie = null;
	}
	
	//Connects to the bridge, loggs in and gets a session cookie (it will be called automatically if nesessary)
	connect = function() {
		return new Promise((resolve, reject) => {
			getSessionCookie(this.host, this.password).then((cookie) => {
				this.cookie = cookie;
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	};
	
	//Requests the status of all devices from the bridge
	getDevicesStatus = function(secTry = false) {
		//GET http://192.168.178.75/v4/devices?devtype=Actuator
		
		//Get Actuator status
		return new Promise((resolve, reject) => {
			request({
				method: "GET",
				json: true,
				uri: "http://" + this.host + "/v4/devices?devtype=Actuator",
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
					"Cookie": this.cookie
				}
			}, (err, res, data) => {
				if (res && res.statusCode == 401) { //Unauthorized
					if (secTry)  {
						if (err) return reject(err);
						return reject("Connection error"); //This is the second try
					}
					this.connect().then(() => { //Try to connect (get a new session cookie)
						//Reconnected. Execute the original command again
						this.getDevicesStatus(true).then((data) => { 
							resolve(data); 
						}).catch((err) => { 
							reject(err); 
						});
					}).catch((err) => {
						reject(err); //Connection error
					});
				} else if (res && res.statusCode == 200) {
					resolve(data);
				} else if (res && res.statusCode == 400) {
					reject(data);
				} else if (res) {
					reject({statusCode: res.statusCode, error: data});
				}
			});
		});
	};
	
	//Executes a device command 
	deviceCommand = function(deviceId, command, secTry = false) {
		//PUT http://192.168.178.75/devices/1
		
		//Get Actuator status
		return new Promise((resolve, reject) => {
			request({
				method: "PUT",
				json: command,
				uri: "http://" + this.host + "/devices/" + deviceId,
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
					"Cookie": this.cookie
				}
			}, (err, res, data) => {
				if (res.statusCode == 401) { //Unauthorized
					if (secTry)  {
						if (err) return reject(err);
						return reject("Connection error"); //This is the second try
					}
					this.connect().then(() => { //Try to connect (get a new session cookie)
						//Reconnected. Execute the original command again
						this.deviceCommand(deviceId, command, true).then((data) => { 
							resolve(data); 
						}).catch((err) => { 
							reject(err); 
						});
					}).catch((err) => {
						reject(err); //Connection error
					});
				} else if (res && res.statusCode == 200) {
					resolve(data);
				} else if (res && res.statusCode == 400) {
					reject(data);
				} else if (res) {
					reject({statusCode: res.statusCode, error: data});
				}
			});
		});
	};
	
}

exports.Bridge = Bridge;