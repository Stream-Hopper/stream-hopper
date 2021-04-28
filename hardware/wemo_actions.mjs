import Wemo from 'wemo'
class WEMOAPI {
	constructor(name){
		this.name = name;
	}
	set_wemo_on(){
		var wemo_name = this.name;
		Wemo.Search(this.name, function(err,device){
			var wemoSwitch = new Wemo(device.ip, device.port);
			wemoSwitch.setBinaryState(1, function(err,result){
				if(err) console.error(err);
				var state = (result == '1') ? 'on' : 'off';
				console.log(wemo_name + ' is now ' + state);
			});
		});
	}
	set_wemo_off(){
		var wemo_name = this.name;
		Wemo.Search(this.name, function(err,device){
            console.log(device)
			var wemoSwitch = new Wemo(device.ip, device.port);
			wemoSwitch.setBinaryState(0, function(err,result){
				if(err) console.error(err);
				var state = (result == '1') ? 'on' : 'off';
				console.log(wemo_name + ' is now ' + state);
			});
		});
	}
	state_of_wemo(){
		var wemo_name = this.name;
		Wemo.Search(this.name, function(err,device){
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
