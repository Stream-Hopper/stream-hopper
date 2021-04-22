import Wemo from 'wemo'

function list_wemos(){
}

function set_wemo_on(name){
	Wemo.Search(name, function(err,device){
		var wemoSwitch = new Wemo(device.ip, device.port);
		wemoSwitch.setBinaryState(1, function(err,result){
			if(err) console.error(err);
			var state = (result == '1') ? 'on' : 'off';
			console.log(name + ' is now ' + state);
		});
	});
}

function set_wemo_off(name){
	Wemo.Search(name, function(err,device){
		var wemoSwitch = new Wemo(device.ip, device.port);
		wemoSwitch.setBinaryState(0, function(err,result){
			if(err) console.error(err);
			var state = (result == '1') ? 'on' : 'off';
			console.log(name + ' is now ' + state);
		});
	});
}

function state_of_wemo(name){
	Wemo.Search(name, function(err,device){
		var wemoSwitch = new Wemo(device.ip, device.port);
		wemoSwitch.getBinaryState(function(err,result){
			if(err) console.error(err);
			var state = (result == '1') ? 'on' : 'off';
			console.log(name + ' is ' + state);
		});
	});
}

export {set_wemo_on, set_wemo_off, state_of_wemo};
