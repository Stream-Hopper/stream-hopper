import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import axios from 'axios';
import EventDatabase from '../../db/EventDatabase.mjs';
import StreamLabsAPI from '../streamlabs_api.js';
import TwitchAPI from '../twitch_api.js';
import { LIFXAPI } from '../../hardware/lifxapi.mjs';
import { WEMOAPI } from '../../hardware/wemo_actions.mjs'
import { GPIOAPI } from '../../hardware/GPIOAPI.mjs';
import { USBAPI } from '../../hardware/usb.mjs';
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8080

var triggerDict = {};

// StreamLabs Tokens
// Tokens for the bot in use - will eventually get these from GUI and save them securely
var streamlabsClientID = 'lzEr0OVv9OWUqm8vW7QWO4B5XigrQc0dxFcLvrLk';
var streamlabsClientSecret = 'mBNuOyyOQgysLOHzkZVnQO8iPtxdg58KKGSB4boY';
var streamlabsAccessToken = null;
var streamlabsSocketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkZBNUJCMDU3MDY4QUY2NDY5ODE2IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNjUwOTM3NjU0In0.Ex-u_IFcemQLdcXPenfOQqQRnSe2mSN111X_gavMZzo';
var streamlabsRefreshToken = null;
var streamlabsUri = 'http://localhost:3000';
var streamlabsRedirectURI = 'http://localhost:3000'

// Twitch Tokens
// Bot tokens and such
// These should be changed to the StreamHopper's credentials (obviously)
var twitchClientID = 'ar72ur9ntqzd1cvwpmz6xroqmcqvjy';
var twitchAccessToken = '29qqic0xdts63hqz85ejlwvcfvt034';
var twitchClientSecret = '2j1mrczgesxx88lphqt1ih68n1n9vu';
var twitchRefreshToken = 'uwq0krupsxw63a1lovgxxsdcz7g7uccirhxhy1hqr0o5w6cem1';
var twitchDevUsername = 'Stream_Hoppers';
var twitchChannelUsername = 'Stream_Hoppers';
var twitchUserID = await getUserID(twitchChannelUsername, twitchClientID);
var twitchRedirectURI = 'http://localhost:3000'
var ex

// Create the Database instance
var EventDB = new EventDatabase.EventDatabase('db/streamhopper.sqlite');

var streamlabsAPIClient;
var twitchClient;


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

  app.post('/api/getToken/streamlabs', async (req, res) => {
    let code = req.body.code;

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
        streamlabsAccessToken = json.access_token;
        streamlabsRefreshToken = json.refresh_token;
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
        twitchAccessToken = json.access_token,
        twitchRefreshToken = json.refresh_token
      })
      .catch(err => console.error('error:' + err));
  });


  // Endpoint that hosts an audio file.. 
  // Used by the Streamlabs API for donation alert audio 
  app.get('/audio/:filename', (req, res) => {
    if (process.platform == 'win32'){
      res.sendFile(process.cwd() + `\\api\\api_server\\sounds\\${req.params.filename}`);
    }else{
      //res.sendFile(_dirname + `/api_server/sounds/${req.params.filename}`);
      res.sendFile(process.cwd() + `/api/api_server/sounds/${req.params.filename}`);
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

  app.post('/api/deleteDevice', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.device_DELETE(req.body.deviceId,cb)
  });

  app.post('/api/devicePerId', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.device_LIST(req.body.deviceId,cb)
  });

  app.post('/api/deviceUpdate', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.device_UPDATE(req.body.deviceId, req.body.deviceName, req.body.deviceLabel, req.body.deviceType,cb)
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
  app.post('/api/deletePreset', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.presets_DELETE(req.body.presetId,cb)
  });

  app.post('/api/presetPerId', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.preset_LIST(req.body.presetId,cb)
  });

  app.post('/api/presetUpdate', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.presets_UPDATE(req.body.presetId,req.body.presetName,req.body.defaultPreset,cb)
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

  app.post('/api/getTriggersPerPreset', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listTriggersPerPreset(req.body.presetId,cb)
  });

  app.post('/api/getTriggerIdForName', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.findIdForName(req.body.triggerName,cb)
  });

  app.post('/api/deleteTrigger', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.triggers_DELETE(req.body.triggerId,cb)
  });

  app.post('/api/presetPerTrigger', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.listPresetsPerTrigger(req.body.triggerId,cb)
  });

  app.post('/api/triggerPerId', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.trigger_LIST(req.body.triggerId,cb)
  });

  app.post('/api/triggerUpdate', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.triggers_UPDATE(req.body.triggerName,req.body.deviceId,req.body.triggerType,req.body.triggerActionId,req.body.options,req.body.triggerId,cb)
  });

  app.post('/api/triggerPresetMap', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.P2TMAP_INSERT(req.body.triggerId,req.body.presetId,cb)
  });
  app.post('/api/triggerPresetMapDelete', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.P2TMAP_DELETE(req.body.presetId,req.body.triggerId,cb)
  });
  app.post('/api/triggerMapDelete', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.P2TMAP_DELETE_TRIGGER(req.body.triggerId,cb)
  });


  app.post('/api/triggerDictPerId', async (req, res) => {
    // EventDB.listDevices()
    const cb = function (data) {
      
      res.send(data)
    }
    EventDB.dictFormatTrigger(req.body.triggerId,cb)
  });



  app.post('/api/receiveDict', async (req, res) => {
    // EventDB.listDevices()
    // console.log(req.body.triggerDict,"THIS IS OUR DICTIONARY")
    console.log(req.body.triggerArray, 'incoming arrray')
    triggerDict = req.body.triggerArray
    console.log(triggerDict,'IN ORDER')
    res.send('GOT IT')
    
  });

  app.get('/api/getUserInfo', async (req, res) => {
    if(twitchRefreshToken != null && twitchAccessToken != null && streamlabsAccessToken != null && streamlabsRefreshToken != null){
      streamlabsAPIClient = new StreamLabsAPI(streamlabsAccessToken, streamlabsSocketToken, event_handler.findEventMatch);
      twitchClient = new TwitchAPI(twitchChannelUsername, twitchDevUsername, twitchClientID, twitchAccessToken, twitchClientSecret, twitchUserID, twitchRefreshToken, event_handler.findEventMatch);
      // start the Event Subscription API
      await twitchClient.startEventSubs();
      res.send('1');
      return;
    }else{
      res.send('0');
    }

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

  }

  /* Incoming API message is matched to triggers set
   * by the GUI, then sends triggers based off matches
   */
  findEventMatch(apiMessage) {
    if (apiMessage.type in triggerDict) {
      triggerDict[apiMessage.type].forEach(function (trigger, index) {
          console.log(trigger.trigger_type_name)
        switch(trigger.action) {
          case 'setState':      LIFXAPIClient.setState(trigger.device_label, 'on', trigger.options); break;
          case 'togglePower':   LIFXAPIClient.togglePower(trigger.device_label); break;
          case 'breatheEffect': LIFXAPIClient.breatheEffect(trigger.device_label, trigger.options, "#000000", 1, 10); break;
          case 'moveEffect':    LIFXAPIClient.moveEffect(trigger.device_label); break;
          case 'pulseEffect':   LIFXAPIClient.pulseEffect(trigger.device_label, trigger.options, "#000000", 1, 10); break;
          case 'wemoOn':        WEMOAPIClient.set_wemo_on(trigger.device_label); break;
          case 'wemoOff':       WEMOAPIClient.set_wemo_off(trigger.device_label); break;
          case 'usbOn':         USBAPIClient.turnOnUSBPorts(); break;
          case 'usbOff':        USBAPIClient.turnOffUSBPorts(); break;
          case 'gpioOn':        GPIOAPIClient.toggle(trigger.device_label, 1); break;
          case 'gpioOff':       GPIOAPIClient.toggle(trigger.device_label, 0); break;
          case 'playAudio':     streamlabsAPIClient.donationAlert(trigger.options); break;
          case 'playTTS':       if (apiMessage.hasOwnProperty('message'))
                                {
                                    streamlabsAPIClient.ttsAlert(apiMessage.message); break;
                                }
                                else
                                {
                                    streamlabsAPIClient.ttsAlert(trigger.options); break;
                                }
        }
      });
    }
  }
}

// Hardware Layer Instantiations
const apiToken = 'c4621a4caa85f0cec707126c639dad3d6f3e2fd324d89ee496def6dd9c1f08c1';
const LIFXAPIClient = new LIFXAPI(apiToken);
const WEMOAPIClient = new WEMOAPI();
const GPIOAPIClient = new GPIOAPI();
//const USBAPIClient = new USBAPI();
//await USBAPIClient.init();
await LIFXAPIClient.init();

// init the event handler
const event_handler = new Event_Handler();