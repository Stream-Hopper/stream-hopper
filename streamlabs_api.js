// http request library
const fetch = require('node-fetch');
// Used for URL params
const { URLSearchParams } = require('url');
// File system library
const fs = require('fs');
// Socket Library for Streamlabs Socket API
const io = require('socket.io-client');

// Helper Functions
function isWindowsOS(){
  return process.platform == "win32";
}

class StreamLabsAPI {
  constructor(accessToken, socketToken){
    this.accessToken = accessToken;
    this.socketToken = socketToken;
    // Create websocket connection with StreamLabs
    this.streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {transports: ['websocket']});
    // Successful connection
    this.streamlabs.on('connect', () => {
      console.log("Connected to StreamLabs Socket API...");
    });
    // Handle events from Socket API
    this.streamlabs.on('event', (eventData) => {
      if (!eventData.for && eventData.type == "donation"){
        // Add more event handlers here as needed
        this.onDonation(eventData);
      }
    });
  }

  async getTTSURL(ttsText){
    var baseUrl = 'https://streamlabs.com/polly/speak';
    var params = new URLSearchParams();

    // Add params - make this better too
    params.append('service', 'Polly');
    params.append('voice', 'Brian');
    params.append('text', ttsText);

    const options = { 
        method: 'POST', 
        body: params
    };

    // Send POST request
    let url = fetch(baseUrl, options)
        .then(res => res.json())
        .then(json => { 
          return json.speak_url; 
        })
        .catch(err => console.error('error:' + err));
    
    return url;
  }

  async ttsAlert(ttsText){
    let url = await this.getTTSURL(ttsText);
    var baseUrl = 'https://streamlabs.com/api/v1.0/alerts';
    var params = new URLSearchParams();
  
    // Add all parameters - there are more parameters but these are the required ones
    // Maybe later we can make this better and have defaults and such (make this a function
    // and have option params where we intelligently decide what params to add based on
    // the API request type i.e. donation, follow, etc.)
    params.append('access_token', this.accessToken);
    params.append('type', 'donation');
    params.append('image_href', null);
    params.append('message', ' ');
    params.append('user_message', ' ');
    params.append('sound_href', url);
  
    const options = { 
      method: 'POST', 
      body: params
    };
  
    // Send the POST request
    fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
  }
  
  // Trigger custom donation alert... pass any audio filename to this and that's it
  // Also the webserver needs to be running in api/audio_server for this to work
  donationAlert(filename){
    // Check if audio file used for alert is present in "sounds" directory
    if (isWindowsOS()){
      var audioFilePath = __dirname + `\\api_server\\sounds\\${filename}`;
      if (!fs.existsSync(audioFilePath)){
        console.log(`Audio File Path Doesn\'t Exist\nAdd desired audio file to the \"${__dirname + '\\audio_server\\sounds'}\" folder...`, );
        return;
      }
    }else{
      var audioFilePath = __dirname + `/api_server/sounds/${filename}`;
      if (!fs.existsSync(audioFilePath)){
        console.log(`Audio File Path Doesn\'t Exist\nAdd desired audio file to the \"${__dirname + '/audio_server/sounds'}\" folder...`, );
        return;
      }
    }
  
    var baseUrl = 'https://streamlabs.com/api/v1.0/alerts';
    var params = new URLSearchParams();
  
    // Add all parameters - there are more parameters but these are the required ones
    // Maybe later we can make this better and have defaults and such (make this a function
    // and have option params where we intelligently decide what params to add based on
    // the API request type i.e. donation, follow, etc.)
    params.append('access_token', this.accessToken);
    params.append('image_href', null);
    params.append('message', ' ');
    params.append('user_message', ' ');
    params.append('sound_href', `http://localhost:8080/audio/${filename}`);
  
    const options = { 
      method: 'POST', 
      body: params
    };
  
    // Send the POST request
    fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
  }

  // Fix parameters here too
  postDonation(name, identifier, amount, currency){

    var baseUrl = 'https://streamlabs.com/api/v1.0/donations';
    var params = new URLSearchParams();
    
    // Add params - make this better too
    params.append('name', name);
    params.append('identifier', identifier);
    params.append('amount', amount);
    params.append('currency', currency);
    params.append('access_token', this.accessToken);
  
    const options = { 
      method: 'POST', 
      body: params
    };
  
    // Send POST request
    fetch(baseUrl, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
  }

  // Do stuff when a donation arrives
  onDonation(eventData){
    eventData.message.forEach(element => {
      var name = element['from'];
      var amount = element['formattedAmount'];
      var currency = element['currency'];
      var message = element['currency'];
      // Eventually send this to control Layer
      var response = {
        "sender": name,
        "amount": amount,
        "currency": currency,
        "message": message,
        "type": "donation"
      }
      console.log(`Received donation from ${name} for ${amount} ${currency}`);
    });
  }
}

// Example function calls
//const streamlabsAPIClient = new StreamLabsAPI(accessToken, socketToken);
//streamlabsAPIClient.donationAlert('im-kind-of-retarded-alex-jones.mp3');
//streamlabsAPIClient.postDonation('Test', 1337, 13.37, 'USD');

module.exports = StreamLabsAPI;
