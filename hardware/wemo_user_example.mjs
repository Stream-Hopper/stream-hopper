import { WEMOAPI } from './wemo_actions.mjs';

let wemo = new WEMOAPI("StreamHopper1");
wemo.set_wemo_off();

setTimeout(function() {
    wemo.set_wemo_on();
}, 3000);

setTimeout(function() {
    wemo.state_of_wemo();
}, 5000);
