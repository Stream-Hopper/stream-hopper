// NOTE:
// This file will be much different when we actually start to implement
// the control layer with all the logic and such so don't rely
// on anything done in this file.

// Although it may be useful to see how stuff is called/used

import StreamLabsAPI from './streamlabs_api.js';
import TwitchAPI from './twitch_api.js';
import API from './api_server/server.js';
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
const twitchChannelUsername = userData[0].twitch_channel_username;
const twitchUserID = userData[0].twitch_channel_id;

// Create API Objects
const streamlabsAPIClient = new StreamLabsAPI(streamlabsAccessToken, streamlabsSocketToken);
const twitchClient = new TwitchAPI(twitchChannelUsername, twitchDevUsername, twitchClientID, twitchAccessToken, twitchClientSecret, twitchUserID, twitchRefreshToken);

// Example function calls
twitchClient.startEventSubs();
streamlabsAPIClient.postDonation('Test', 1337, 13.37, "USD");
streamlabsAPIClient.donationAlert('im-kind-of-retarded-alex-jones.mp3');
streamlabsAPIClient.donationAlert('tedcruz-mistake.mp3');
streamlabsAPIClient.ttsAlert('This is a really cool test');

