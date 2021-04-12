// http request library
import fetch from 'node-fetch'; 

// Search Params Creator
import { URLSearchParams } from 'url';

// LIFX API Class
class LIFXAPI {
    constructor(apiToken){
        // API Token used in all HTTP Requests
        this.apiToken = apiToken;
        // JSON of all LIFX Devices on the account
        // of the form {deviceName: deviceID}
        this.deviceIDs = {};
    }

    // Create a JSON of all the devices for the user's account
    async init(){
        await fetch('https://api.lifx.com/v1/lights/all', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.hasOwnProperty('error')){
                console.log('Something Bad Happened...');
            }else{
                data.forEach(element => {
                    this.deviceIDs[element['label']] = element['id'];
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    setState(deviceName, power, color, brightness=null, duration=null, infared=null, fast=null){
        var baseUrl = `https://api.lifx.com/v1/lights/${this.deviceIDs[deviceName]}/state`;
        var params = new URLSearchParams();
        
        // Add params - make this better too
        params.append('power', power);
        params.append('color', color);
        if(brightness != null){
            params.append('brightness', brightness);
        }
        if(duration != null){
            params.append('duration', duration);
        }
        if(infared != null){
            params.append('infrared', infared);
        }
        if(fast != null){
            params.append('fast', fast);
        }
    
        const options = { 
            method: 'PUT', 
            body: params,
            headers: {
                "Authorization": `Bearer ${this.apiToken}`
            }
        };
    
        // Send POST request
        fetch(baseUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
    }    

    togglePower(deviceName, duration=null){
        var baseUrl = `https://api.lifx.com/v1/lights/${this.deviceIDs[deviceName]}/toggle`;
        var params = new URLSearchParams();
        
        // Add params - make this better too
        if(duration != null){
            params.append('duration', duration);
        }
    
        const options = { 
            method: 'POST', 
            body: params,
            headers: {
                "Authorization": `Bearer ${this.apiToken}`
            }
        };
    
        // Send POST request
        fetch(baseUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error: ' + err));
    }

    breatheEffect(deviceName, color, from_color=null, period=null, cycles=null, persist=null, power_on=null, peak=null){
        var baseUrl = `https://api.lifx.com/v1/lights/${this.deviceIDs[deviceName]}/effects/breathe`;
        var params = new URLSearchParams();
        
        // Add params - make this better too
        params.append('color', color);
        if (from_color != null){
            params.append('from_color', from_color);
        }
        if (period != null){
            params.append('period', period);
        }
        if (cycles != null){
            params.append('cycles', cycles);
        }
        if (persist != null){
            params.append('persist', persist);
        }
        if (power_on != null){
            params.append('power_on', power_on);
        }
        if (peak != null){
            params.append('peak', peak);
        }
    
        const options = { 
            method: 'POST', 
            body: params,
            headers: {
                "Authorization": `Bearer ${this.apiToken}`
            }
        };
    
        // Send POST request
        fetch(baseUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error: ' + err));
    }

    moveEffect(deviceName, direction=null, period=null, cycles=null, power_on=null, fast=null){
        var baseUrl = `https://api.lifx.com/v1/lights/${this.deviceIDs[deviceName]}/effects/move`;
        var params = new URLSearchParams();
        
        // Add params - make this better too
        if(direction != null){
            params.append('direction', direction);
        }
        if(period != null){
            params.append('period', period);
        }
        if(cycles != null){
            params.append('cycles', cycles);
        }
        if(power_on != null){
            params.append('power_on', power_on);
        }
        if(fast != null){
            params.append('fast', fast);
        }
    
        const options = { 
            method: 'POST', 
            body: params,
            headers: {
                "Authorization": `Bearer ${this.apiToken}`
            }
        };
    
        // Send POST request
        fetch(baseUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error: ' + err));
    }

    pulseEffect(deviceName, color, from_color=null, period=null, cycles=null, persist=null, power_on=null){
        var baseUrl = `https://api.lifx.com/v1/lights/${this.deviceIDs[deviceName]}/effects/pulse`;
        var params = new URLSearchParams();
        
        // Add params - make this better too
        params.append('color', color);
        if(from_color != null){
            params.append('from_color', from_color);
        }
        if(period != null){
            params.append('period', period);
        }
        if(cycles != null){
            params.append('cycles', cycles);
        }
        if(persist != null){
            params.append('persist', persist);
        }
        if(power_on != null){
            params.append('power_on', power_on);
        }
    
        const options = { 
            method: 'POST', 
            body: params,
            headers: {
                "Authorization": `Bearer ${this.apiToken}`
            }
        };
    
        // Send POST request
        fetch(baseUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error: ' + err));
    }
}

export { LIFXAPI };