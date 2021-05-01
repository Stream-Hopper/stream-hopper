// TODO: -Add better connection error handling
//       -Add more events if necessary
//       -Add the passing of response JSON objects to Control Layer
//       -Add access token refresh on connection failure (https://dev.twitch.tv/docs/authentication)
//       -Store tokens more securely
//       -Remove my account and put the real one xdddd
//       -Verify the bot account

// tmi.js documentation https://github.com/tmijs/docs/tree/gh-pages/_posts/v1.4.2
const tmi = require('tmi.js');

// twitch module documentation https://d-fischer.github.io/twitch-eventsub/
const twitch = require('twitch');
const twitch_auth = require('twitch-auth');
const twitch_eventsub = require('twitch-eventsub');
const ngrok = require('twitch-eventsub-ngrok');

const fetch = require('node-fetch');

var thisModal;

class TwitchAPI {
    constructor(username, devUsername, clientID, accessToken, clientSecret, userID, refreshToken, eventHandlerFunc){
        this.opts = {
            channels: [
                username
            ]
        };
        this.username = username;
        this.devUsername = devUsername;
        this.clientID = clientID;
        this.accessToken = accessToken;
        this.clientSecret = clientSecret;
        this.userID = userID;
        thisModal = this;
        this.eventHandlerFunc = eventHandlerFunc;
        this.client = new tmi.client(this.opts);
        this.client.on('message', this.onMessage);
        this.client.on('subscription', this.onSubscription);
        this.client.on('resub', this.onResub);
        this.client.on("cheer", this.onCheer);
        this.client.connect().then(()=>{
            console.log("Connected to %s...", this.username);
        }).catch(err => {
            console.log("Connection Error...");
            console.log(err);
        });
        // Setup up EventSub Listener for EventSub Events (basically just for stuff not in tmi.js)
        this.authProvider = new twitch_auth.RefreshableAuthProvider(
            new twitch_auth.ClientCredentialsAuthProvider(clientID, clientSecret),
            {
                clientSecret,
                refreshToken,
            }
        );
        this.apiClient = new twitch.ApiClient({ authProvider: this.authProvider });
        this.listener = new twitch_eventsub.EventSubListener(this.apiClient, new ngrok.NgrokAdapter(), 'streamhopper');
    }

    static async getUserID(username, clientID){
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

    // Message handler, will forward response to control layer
    onMessage(channel, userstate, message, self){
        if (self) return;
        var response = {
            "sender": userstate['display-name'],
            "message": message,
            "type": "chatMessage"
        };
        thisModal.eventHandlerFunc(response);
        console.log('%s: %s', userstate['display-name'], message);
    }

    // Subscription handler, will forward response to control layer
    onSubscription(channel, username, method, message, userstate){
        var response = {
            "sender": userstate['display-name'],
            "message": message,
            "type": "subscription"
        };
        thisModal.eventHandlerFunc(response);
        console.log('%s has subscribed', userstate['display-name']);
    }

    // Re-Subscription handler, will forward response to control layer
    onResub(channel, username, months, message, userstate, methods){
        var response = {
            "sender": userstate['display-name'],
            "message": message,
            "months": months,
            "type": "resub"
        };
        thisModal.eventHandlerFunc(response);
        console.log('%s has resubscribed for %d months', userstate['display-name'], months);
    }

    // Cheer handler, will forward response to control layer
    onCheer(channel, userstate, message){
        var response = {
            "sender": userstate['display-name'],
            "message": message,
            "amount": userstate['bits'],
            "type": "cheer"
        };
        thisModal.eventHandlerFunc(response);
        console.log('%s has cheered %d bits', userstate['display-name'], userstate['bits']);
    }

    // Follow handler, will forward response to control layer
    onFollow(followEvent){
        var response = {
            "sender": followEvent.userDisplayName,
            "type": "follow"
        };
        thisModal.eventHandlerFunc(response);
        console.log("%s has followed %s at %s", followEvent.userDisplayName, followEvent.broadcasterDisplayName, followEvent.followDate);
    }

    onChannelPointRedemption(redemptionEvent){
        var response = {
            "sender": redemptionEvent.userDisplayName,
            "input": redemptionEvent.input,
            "ID": redemptionEvent.rewardId,
            "title": redemptionEvent.rewardTitle,
            "type": "channelPointRedemption"
        };
        thisModal.eventHandlerFunc(response);
        console.log("%s has redeemed %s", redemptionEvent.userDisplayName, redemptionEvent.rewardTitle);
    }

    // Start EventSubs (basically just stuff not included in tmi.js)
    async startEventSubs(){
        await this.listener.listen().then(() => {
            console.log("Listening for Event Subscriptions...");
        });
        await this.apiClient.helix.eventSub.deleteAllSubscriptions();
        await this.listener.subscribeToChannelFollowEvents(this.userID, this.onFollow);
        await this.listener.subscribeToChannelRedemptionAddEvents(this.userID, this.onChannelPointRedemption);
    }
}

module.exports = TwitchAPI;
