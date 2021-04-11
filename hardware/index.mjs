import { LIFXAPI } from './lifxapi.mjs';
import { USBAPI } from './usb.mjs';

const apiToken = 'c4621a4caa85f0cec707126c639dad3d6f3e2fd324d89ee496def6dd9c1f08c1';

const LIFXAPIClient = new LIFXAPI(apiToken);
const USBAPIClient = new USBAPI();
await USBAPIClient.init();
await USBAPIClient.turnOffUSBPorts();

//await LIFXAPIClient.init();

//LIFXAPIClient.pulseEffect('Backlight', '#0000ff');
