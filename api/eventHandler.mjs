import { LIFXAPI } from './lifxapi.mjs';


const LIFXAPIClient = new LIFXAPI(apiToken);
await LIFXAPIClient.init();

function eventHandlerFunc(){
    LIFXAPIClient.pulseEffect('Backlight', '#0000ff');
}

export {eventHandlerFunc}