import fetch from 'node-fetch';
import express from 'express';
import Database from './db.mjs';
import bodyParser from 'body-parser';
import cors from 'cors'
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8080

// All our important information... this will be stored in the database
const twitchScopes = "user_read+user_blocks_edit+user_blocks_read+user_follows_edit+channel_read+channel_editor+channel_commercial+channel_stream+channel_subscriptions+user_subscriptions+channel_check_subscription+channel_feed_read+channel_feed_edit+collections_edit+communities_edit+communities_moderate+viewing_activity_read+openid+analytics:read:extensions+user:edit+user:read:email+clips:edit+bits:read+analytics:read:games+user:edit:broadcast+user:read:broadcast+chat:read+chat:edit+channel:moderate+channel:read:subscriptions+whispers:read+whispers:edit+moderation:read+channel:read:redemptions+channel:edit:commercial+channel:read:hype_train+channel:read:stream_key+channel:manage:extensions+channel:manage:broadcast+user:edit:follows+channel:manage:redemptions+channel:read:editors+channel:manage:videos+user:read:blocked_users+user:manage:blocked_users+user:read:subscriptions";
const twitchClientID = 'ar72ur9ntqzd1cvwpmz6xroqmcqvjy';
const streamlabsClientID = 'lzEr0OVv9OWUqm8vW7QWO4B5XigrQc0dxFcLvrLk';
const streamlabsClientSecret = 'mBNuOyyOQgysLOHzkZVnQO8iPtxdg58KKGSB4boY';
const streamlabsScopes = 'donations.read+donations.create+alerts.create+legacy.token+socket.token+alerts.write+credits.write+profiles.write+jar.write+wheel.write+mediashare.control';
const streamlabsSocketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkZBNUJCMDU3MDY4QUY2NDY5ODE2IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNjUwOTM3NjU0In0.Ex-u_IFcemQLdcXPenfOQqQRnSe2mSN111X_gavMZzo';
const twitchClientSecret = '2j1mrczgesxx88lphqt1ih68n1n9vu';
const twitchRedirectURI = 'http://localhost:3000';
const streamlabsRedirectURI = 'http://localhost:3000';

// We will get this value from the user in the GUI
var twitchChannelUsername = null;

// This will be called by the GUI ultimately but its here for testing purposes
var twitchUserID = null;

// Create the Database instance
var userDatabase = new Database.Database('./db.sqlite');

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

  app.post('/api/updateUsername', async (req, res) => {
    let username = req.body.username;
    let id = await getUserID(username, twitchClientID);
    if(id == -1){
      res.send({status: "failed", error: 'Invalid Twitch Name'});
    }else{
      twitchChannelUsername = username;
      twitchUserID = id;
      userDatabase.editData({twitch_channel_username: username, twitch_channel_id: id});
      res.send({status: "success"});
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

  return app;
}