import fetch from 'node-fetch';
import express from 'express';
import Database from './db.mjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import EventDatabase from '../../db/EventDatabase.mjs';
import StreamLabsAPI from '../streamlabs_api.js';
import TwitchAPI from '../twitch_api.js';
import { LIFXAPI } from '../../hardware/lifxapi.mjs';
import { WEMOAPI } from '../../hardware/wemo_actions.mjs'
import { GPIOAPI } from '../../hardware/GPIOAPI.mjs';
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8080

var triggerDict = {};

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

// Create the Database instance
var userDatabase = new Database.Database('./db.sqlite');
var EventDB = new EventDatabase.EventDatabase('db/streamhopper.sqlite');

async function getUserID(username, clientID){
  var baseUrl = `https://api.twitch.tv/kraken/users?login=${username}`;

  const options = { 
      method: 'GET',
      headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': clientID
      }
  };

  // Send POST request
  let userID = await fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => {
          if (json._total == 0){
              return -1;
          }else{
              return json.users[0]._id;
          }
      })
      .catch(err => console.error('error:' + err));
  return userID;
}


// API Endpoints
export default async function API(){
  const server = app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
  })

  app.get('/api/getUser', (req, res) => {
    let row, err = userDatabase.queryDatabase((rows) => {
      if (rows){
        res.json({
          data: rows
        });
        return;
      }
      res.send({
        error: "query returned 0 rows..."
      })
    });
  });

  // Returns a json on identifying whether or not the Twitch
  // account has authorized our bot to access its data..
  app.get('/api/verify/twitch', (req, res) => {
    let row, err = userDatabase.queryDatabase((rows) => {
      if (rows){
        let entry = rows[0];
        if (entry.twitch_access_token != null && entry.twitch_refresh_token != null){
          res.json({
            verified: true,
            access_token: entry.twitch_access_token,
            refresh_token: entry.twitch_refresh_token
          })
          return;
        }
      }
      res.json({
        verified: false,
        access_token: null,
        refresh_token: null
      })
    });
  });

  // Returns a json on identifying whether or not the Streamlabs
  // account has authorized our bot to access its data..
  app.get('/api/verify/streamlabs', (req, res) => {
    let row, err = userDatabase.queryDatabase((rows) => {
      if (rows){
        let entry = rows[0];
        if (entry.streamlabs_access_token != null && entry.streamlabs_refresh_token != null){
          res.json({
            verified: true,
            access_token: entry.streamlabs_access_token,
            refresh_token: entry.streamlabs_refresh_token
          })
          return;
        }
      }
      res.json({
        verified: false,
        access_token: null,
        refresh_token: null
      })
    });
  });

  // Endpoint that gets a access token for Streamlabs
  // Users will login via Streamlabs when redirected to this url
  // and an access key will then be retreived automatically
  app.get('/auth/streamlabs', async (req,res) => {
    res.redirect(`https://www.streamlabs.com/api/v1.0/authorize?client_id=${streamlabsClientID}&redirect_uri=${streamlabsRedirectURI}&response_type=${'code'}&scope=${streamlabsScopes}`);
  });

  // Endpoint that gets a access token for Twitch
  // Users will login via Twitch when redirected to this url
  // and an access key will then be retreived automatically
  app.get('/auth/twitch', async (req, res) => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientID}&redirect_uri=${twitchRedirectURI}&response_type=${'code'}&scope=${twitchScopes}`);
  })

  // Redirect URI used by the Streamlabs API when the user authorizes their account 
  app.get('/streamlabs', async (req, res) => {

    let code = req.query.code;
    let accessToken;
    let refreshToken;

    var baseUrl = 'https://streamlabs.com/api/v1.0/token';
    var params = new URLSearchParams();

    params.append('client_id', streamlabsClientID);
    params.append('client_secret', streamlabsClientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', streamlabsRedirectURI);

    const options = { 
      method: 'POST',
      body: params
    };

    // Send the POST request
    await fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => {
        res.send(json);
        let query = {
          streamlabs_access_token: json.access_token,
          streamlabs_refresh_token: json.refresh_token
        }
        userDatabase.editData(query);
      })
      .catch(err => console.error('error:' + err));
    
  })

  app.post('/api/getToken/streamlabs', async (req, res) => {
    let code = req.body.code;
    let accessToken;
    let refreshToken;

    var baseUrl = 'https://streamlabs.com/api/v1.0/token';
    var params = new URLSearchParams();

    params.append('client_id', streamlabsClientID);
    params.append('client_secret', streamlabsClientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', streamlabsRedirectURI);

    const options = { 
      method: 'POST',
      body: params
    };

    // Send the POST request
    await fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => {
        res.send(json);
        let query = {
          streamlabs_access_token: json.access_token,
          streamlabs_refresh_token: json.refresh_token
        }
        userDatabase.editData(query);
      })
      .catch(err => console.error('error:' + err));
  });


  app.post('/api/getToken/twitch', async (req, res) => {
    let code = req.body.code;
    var baseUrl = 'https://id.twitch.tv/oauth2/token';
    var params = new URLSearchParams();

    params.append('client_id', twitchClientID);
    params.append('client_secret', twitchClientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', twitchRedirectURI);

    const options = { 
      method: 'POST',
      body: params
    };

    // Send the POST request
    await fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => {
        res.send(json);
        let query = {
          twitch_access_token: json.access_token,
          twitch_refresh_token: json.refresh_token
        }
        userDatabase.editData(query);
      })
      .catch(err => console.error('error:' + err));
  });

  // Redirect URI used by the Twitch API when the user authorizes their account 
  app.get('/twitch', async (req, res) => {

    let code = req.query.code;

    var baseUrl = 'https://id.twitch.tv/oauth2/token';
    var params = new URLSearchParams();

    params.append('client_id', twitchClientID);
    params.append('client_secret', twitchClientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', twitchRedirectURI);

    const options = { 
      method: 'POST',
      body: params
    };

    // Send the POST request
    await fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => {
        res.send(json);
        let query = {
          twitch_access_token: json.access_token,
          twitch_refresh_token: json.refresh_token
        }
        userDatabase.editData(query);
      })
      .catch(err => console.error('error:' + err));
  })

  // Endpoint that hosts an audio file.. 
  // Used by the Streamlabs API for donation alert audio 
  app.get('/audio/:filename', (req, res) => {
    if (process.platform == 'win32'){
      res.sendFile(process.cwd() + `\\api_server\\sounds\\${req.params.filename}`);
    }else{
      res.sendFile(process.cwd() + `/api_server/sounds/${req.params.filename}`);
    }
  });

  // DEVICE ENDPOINTS
  app.get('/api/getDevices', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listDevices(cb)
  });
  app.post('/api/addDevice', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.device_INSERT(req.body.deviceName,req.body.deviceLabel,req.body.deviceType,cb)
  });
  app.get('/api/getDeviceType', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listDeviceType(cb)
  });
  app.post('/api/getActionsPerDevice', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listActionsPerDevice(req.body.id,cb)
  });
  // PRESET ENDPOINTS
  app.get('/api/getpresets', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.lisPresets(cb)
  });
  app.post('/api/addPresets', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.presets_INSERT(req.body.presetName,req.body.defaultPreset,cb)
  });
  // TRIGGER ENDPOINTS
  app.get('/api/getTriggers', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listTriggers(cb)
  });
  app.get('/api/getTriggerType', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listTriggerType(cb)
  });
  app.post('/api/addTriggers', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.triggers_INSERT(req.body.triggerName,req.body.deviceId,req.body.triggerTypeId,req.body.triggerActionId,req.body.options,cb)
  });


  // Close the server gracefully 
  process.on('SIGTERM', () => {
    server.close();
    console.log("API closed...");
    process.exit(0);
  });

  // Close the server gracefully 
  process.on('SIGINT', () => {
    server.close();
    console.log("API closed...");
    process.exit(0);
  });

  return app;
}


await API();


// Hardware Layer Instantiations
const apiToken = 'c4621a4caa85f0cec707126c639dad3d6f3e2fd324d89ee496def6dd9c1f08c1';
const LIFXAPIClient = new LIFXAPI(apiToken);
const WEMOAPIClient = new WEMOAPI();
const GPIOAPIClient = new GPIOAPI();
WEMOAPIClient.set_wemo_off("Wemo Mini");
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
    triggerDict = Object();
    triggerDict['donation'] = [];
    triggerDict['follow'] = [];
    triggerDict['channelPointRedemption'] = [];
    triggerDict['subscription'] = [];
    triggerDict['cheer'] = [];
    triggerDict['chatMessage'] = [];
    triggerDict['resub'] = [];

    // Create API Objects
    this.streamlabsAPIClient = new StreamLabsAPI(streamlabsAccessToken, streamlabsSocketToken, this.findEventMatch);
    this.twitchClient = new TwitchAPI(twitchChannelUsername, twitchDevUsername, twitchClientID, twitchAccessToken, twitchClientSecret, twitchUserID, twitchRefreshToken, this.findEventMatch);
  }

  /* Incoming API message is matched to triggers set
   * by the GUI, then sends triggers based off matches
   */
  findEventMatch(apiMessage) {
    if (apiMessage.type in triggerDict) {
      triggerDict[apiMessage.type].forEach(function (trigger, index) {
        switch(trigger.triggerType) {
          case 'setState':      LIFXAPIClient.setState(deviceName, power, color, brightness=null, duration=null, infared=null, fast=null); break;
          case 'togglePower':   LIFXAPIClient.togglePower(deviceName, duration=null); break;
          case 'breatheEffect': LIFXAPIClient.breatheEffect(deviceName, color, from_color=null, period=null, cycles=null, persist=null, power_on=null, peak=null); break;
          case 'moveEffect':    LIFXAPIClient.moveEffect(deviceName, direction=null, period=null, cycles=null, power_on=null, fast=null); break;
          case 'pulseEffect':   LIFXAPIClient.pulseEffect(deviceName, color, from_color=null, period=null, cycles=null, persist=null, power_on=null); break;
          // these need to be updated to accept the hardware backend functions
          case 'wemoOn':        WEMOAPIClient.set_wemo_on(name); break;
          case 'wemoOff':       WEMOAPIClient.set_wemo_off(name); break;
          // case 'usbOn':         LIFXAPIClient.pulseEffect('Lightbulb', trigger.options); break;
          // case 'usbOff':        LIFXAPIClient.pulseEffect('Lightbulb', trigger.options); break;
          case 'gpioOn':        GPIOAPIClient.toggle(portNumber, 1); break;
          case 'gpioOff':       GPIOAPIClient.toggle(portNumber, 0); break;
        }
      });
    }
  }
}

const event_handler = new Event_Handler();
event_handler.twitchClient.startEventSubs();
event_handler.streamlabsAPIClient.postDonation('Test', 1337, 13.37, "USD");