// NOTE:
// This file will be much different when we actually start to implement
// the control layer with all the logic and such so don't rely
// on anything done in this file.

// Although it may be useful to see how stuff is called/used

import StreamLabsAPI from './streamlabs_api.js';
import TwitchAPI from './twitch_api.js';
import API from './api_server/server.js';
import fetch from 'node-fetch';
await API();

// Get all our data from our API (ultimately through the database)
let userData = await fetch('http://localhost:8080/api/getUser')
.then(res => res.json())
.then(json => {
  return json.data;
});

// StreamLabs Tokens
// Tokens for the bot in use - will eventually get these from GUI and save them securely
const streamlabsClientID = userData[0].streamlabs_client_id;
const streamlabsClientSecret = userData[0].streamlabs_client_secret;
const streamlabsAccessToken = userData[0].streamlabs_access_token;
const streamlabsSocketToken = userData[0].streamlabs_socket_token;
const streamlabsRefreshToken = userData[0].streamlabs_refresh_token;
const streamlabsUri = 'http://localhost:8080/streamlabs';

// Twitch Tokens
// Bot tokens and such 
// These should be changed to the StreamHopper's credentials (obviously)
const twitchClientID = userData[0].twitch_client_id;
const twitchAccessToken = userData[0].twitch_access_token;
const twitchClientSecret = userData[0].twitch_client_secret;
const twitchRefreshToken = userData[0].twitch_refresh_token;
const twitchDevUsername = 'Stream_Hoppers';
const twitchChannelUsername = userData[0].twitch_channel_username;
const twitchUserID = await TwitchAPI.getUserID(twitchChannelUsername, twitchClientID);


// This should be in the GUI eventually
if (twitchUserID == -1){
  console.log("invalid Twitch Username");
  process.exit();
}

// Create API Objects
const streamlabsAPIClient = new StreamLabsAPI(streamlabsAccessToken, streamlabsSocketToken);
const twitchClient = new TwitchAPI(twitchChannelUsername, twitchDevUsername, twitchClientID, twitchAccessToken, twitchClientSecret, twitchUserID, twitchRefreshToken);



// Example function calls
twitchClient.startEventSubs();
streamlabsAPIClient.postDonation('Test', 1337, 13.37, "USD");
streamlabsAPIClient.donationAlert('im-kind-of-retarded-alex-jones.mp3');
streamlabsAPIClient.donationAlert('tedcruz-mistake.mp3');
streamlabsAPIClient.ttsAlert('This is a really cool test');
