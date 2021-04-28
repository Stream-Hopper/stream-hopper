import Wemo from 'wemo'
class WEMOAPI {
	constructor(){
	}
	set_wemo_on(wemo_name){
		Wemo.Search(wemo_name, function(err,device){
			var wemoSwitch = new Wemo(device.ip, device.port);
			wemoSwitch.setBinaryState(1, function(err,result){
				if(err) console.error(err);
				var state = (result == '1') ? 'on' : 'off';
				console.log(wemo_name + ' is now ' + state);
			});
		});
	}
	set_wemo_off(wemo_name){
		Wemo.Search(wemo_name, function(err,device){
            console.log(device)
			var wemoSwitch = new Wemo(device.ip, device.port);
			wemoSwitch.setBinaryState(0, function(err,result){
				if(err) console.error(err);
				var state = (result == '1') ? 'on' : 'off';
				console.log(wemo_name + ' is now ' + state);
			});
		});
	}
	state_of_wemo(wemo_name){
		Wemo.Search(wemo_name, function(err,device){
			var wemoSwitch = new Wemo(device.ip, device.port);
			wemoSwitch.getBinaryState(function(err,result){
				if(err) console.error(err);
				var state = (result == '1') ? 'on' : 'off';
				console.log(wemo_name + ' is ' + state);
			});
		});
	}
}
export { WEMOAPI };
