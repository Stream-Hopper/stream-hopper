import StreamLabsAPI from './api/streamlabs_api.js';
import TwitchAPI from './api/twitch_api.js';
import API from './api/api_server/server.js';
import { LIFXAPI } from './hardware/lifxapi.mjs'
//import { WEMOAPI } from './hardware/lifxapi.mjs'
import fetch from 'node-fetch';
import axios from 'axios';
await API();

// Called by the GUI
const res = await axios.post("http://localhost:8080/api/updateUsername", {
  "username": "Stream_Hoppers"
});

console.log(res.data);

// Get all our data from our API (ultimately through the database)
let userData = await fetch('http://localhost:8080/api/getUser')
  .then(res => res.json())
  .then(json => {
    console.log(json.data);
    return json.data;
  });
console.log(userData);


// StreamLabs Tokens
// Tokens for the bot in use - will eventually get these from GUI and save them securely
const streamlabsClientID = 'lzEr0OVv9OWUqm8vW7QWO4B5XigrQc0dxFcLvrLk';
const streamlabsClientSecret = 'mBNuOyyOQgysLOHzkZVnQO8iPtxdg58KKGSB4boY';
const streamlabsAccessToken = '4rh6uxzo34r2rsKQqTPOipVPL9CqL69eQltYoo8V';
const streamlabsSocketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkZBNUJCMDU3MDY4QUY2NDY5ODE2IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNjUwOTM3NjU0In0.Ex-u_IFcemQLdcXPenfOQqQRnSe2mSN111X_gavMZzo';
const streamlabsRefreshToken = 'NZQ6Xbt81eJehfkCNA7XsMICDLG9Kh6yMaGQupL5';
const streamlabsUri = 'http://localhost:3000';

// Twitch Tokens
// Bot tokens and such
// These should be changed to the StreamHopper's credentials (obviously)
const twitchClientID = 'ar72ur9ntqzd1cvwpmz6xroqmcqvjy';
const twitchAccessToken = '29qqic0xdts63hqz85ejlwvcfvt034';
const twitchClientSecret = '2j1mrczgesxx88lphqt1ih68n1n9vu';
const twitchRefreshToken = 'uwq0krupsxw63a1lovgxxsdcz7g7uccirhxhy1hqr0o5w6cem1';
const twitchDevUsername = 'Stream_Hoppers';
//const twitchChannelUsername = userData[0].twitch_channel_username;
//const twitchUserID = userData[0].twitch_channel_id;
const twitchChannelUsername = 'Stream_Hoppers';
const twitchUserID = '650937654';
// const twitchChannelUsername = 'xqcow';
// const twitchUserID = '71092938';

// Hardware Layer Instantiations
const apiToken = 'c4621a4caa85f0cec707126c639dad3d6f3e2fd324d89ee496def6dd9c1f08c1';
const LIFXAPIClient = new LIFXAPI(apiToken);
//const USBAPIClient = new USBAPI();
// await USBAPIClient.init();
// await USBAPIClient.turnOffUSBPorts();
await LIFXAPIClient.init();
//LIFXAPIClient.pulseEffect('Backlight', '#0000ff');



//|////////////////////////////////////////////////
//  Definitions
//|////////////////////////////////////////////////
class Event_Handler {
  //  Function Definitions
  constructor() {
    // dictionary to hold set triggers by GUI
    globalThis.triggerDict = Object();
    // temporarily load dummy info into dict
    globalThis.triggerDict['chatMessage'] = [{ triggerId: 0, triggerName: 'On Chat Message pulse',triggerType: 0, options: '#00FF00' }];
    globalThis.triggerDict['chatMessage'].push({ triggerId: 1, triggerName: 'On Chat Message set color',triggerType: 1, options: '#FF0000' })
    console.log(this.triggerDict);

    // Create API Objects
    this.streamlabsAPIClient = new StreamLabsAPI(streamlabsAccessToken, streamlabsSocketToken, this.findEventMatch);
    this.twitchClient = new TwitchAPI(twitchChannelUsername, twitchDevUsername, twitchClientID, twitchAccessToken, twitchClientSecret, twitchUserID, twitchRefreshToken, this.findEventMatch);
  }

  /* Incoming API message is matched to triggers set
   * by the GUI, then sends triggers based off matches
   */
  findEventMatch(apiMessage) {
    if (apiMessage.type in globalThis.triggerDict) {
      globalThis.triggerDict[apiMessage.type].forEach(function (trigger, index) {
        // this will need to be based off trigger type once we get that far into development
        switch(trigger.triggerType) {
          // case will need to be made for each trigger_type
          case 0: LIFXAPIClient.pulseEffect('Backlight', trigger.options); break;
          case 1: LIFXAPIClient.pulseEffect('Lightbulb', trigger.options); break;
        }
      });
    }
  }
}

// Example function calls
const event_handler = new Event_Handler();
event_handler.twitchClient.startEventSubs();
event_handler.streamlabsAPIClient.postDonation('Test', 1337, 13.37, "USD");
