import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { Redirect,Link,useParams,useHistory } from 'react-router-dom';
import axios from 'axios';
import {useLocalStorage} from '../Hooks/useLocalStorage'


function UserInfo(){

    // const [twitchVerificationStatus, setTwitchVerificationStatus] = useState("Not Verified")
    // const [streamLabsVerificationStatus, setStreamLabsVerificationStatus] = useState("Not Verified")
    const [twitchUsername, setTwitchUsername] = useState("")
    const twitchScopes = "user_read+user_blocks_edit+user_blocks_read+user_follows_edit+channel_read+channel_editor+channel_commercial+channel_stream+channel_subscriptions+user_subscriptions+channel_check_subscription+channel_feed_read+channel_feed_edit+collections_edit+communities_edit+communities_moderate+viewing_activity_read+openid+analytics:read:extensions+user:edit+user:read:email+clips:edit+bits:read+analytics:read:games+user:edit:broadcast+user:read:broadcast+chat:read+chat:edit+channel:moderate+channel:read:subscriptions+whispers:read+whispers:edit+moderation:read+channel:read:redemptions+channel:edit:commercial+channel:read:hype_train+channel:read:stream_key+channel:manage:extensions+channel:manage:broadcast+user:edit:follows+channel:manage:redemptions+channel:read:editors+channel:manage:videos+user:read:blocked_users+user:manage:blocked_users+user:read:subscriptions";
    const twitchClientID = 'ar72ur9ntqzd1cvwpmz6xroqmcqvjy';
    const streamlabsClientID = 'lzEr0OVv9OWUqm8vW7QWO4B5XigrQc0dxFcLvrLk';
    const streamlabsClientSecret = 'mBNuOyyOQgysLOHzkZVnQO8iPtxdg58KKGSB4boY';
    const streamlabsScopes = 'donations.read+donations.create+alerts.create+legacy.token+socket.token+alerts.write+credits.write+profiles.write+jar.write+wheel.write+mediashare.control';
    const streamlabsSocketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkZBNUJCMDU3MDY4QUY2NDY5ODE2IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNjUwOTM3NjU0In0.Ex-u_IFcemQLdcXPenfOQqQRnSe2mSN111X_gavMZzo';
    const twitchClientSecret = '2j1mrczgesxx88lphqt1ih68n1n9vu';
    const twitchRedirectURI = 'http://localhost:3000';
    const streamlabsRedirectURI = 'http://localhost:3000';
    const [twitchVerification, setTwitchVerification] = useLocalStorage('twitchVerification', 'Not Verified');
    const [streamLabsVerification, setStreamLabsVerification] = useLocalStorage('streamLabsVerification', 'Not Verified');
    // const streamlabsRedirectURI = 'http://localhost:3030';

   
      
    // const { code } = useParams();
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get('code');
    let history = useHistory();
      
      function handleTwitchVerify(){

        console.log(code)
        if(code!==undefined){
            axios.post("http://localhost:8080/api/getToken/twitch",{code : `${code}`})
            .then(res=>{
            console.log(res.data)
            if(res.data.access_token!==undefined && res.data.refresh_token!==undefined ){
                setTwitchVerification('Verified')
            }
        })   
        }   
        


    }
    
    function handleStreamLabsVerify(){
            
        console.log(code)
        if(code!==undefined){
            axios.post("http://localhost:8080/api/getToken/streamlabs",{code : `${code}`})
            .then(res=>{
            console.log(res)
            if(res.data.access_token!==undefined && res.data.refresh_token!==undefined ){
                setStreamLabsVerification('Verified')
            }
        })   

    }
    }
    
    return(

        <div>
       

            <div style={{margin: "100px"}}>
            <Table bordered>
            <thead>
                <tr>
                <th>#</th>
                <th>Service</th>
                <th>Login</th>
                <th>Verification</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>Twitch</td>
                <td><a href={`https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientID}&redirect_uri=${twitchRedirectURI}&response_type=${'code'}&scope=${twitchScopes}`} >Login with twitch</a></td>
                <td><button onClick={()=>handleTwitchVerify()}>Verify</button></td>
                <td>{twitchVerification}</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>Stream Labs</td>
                <td><a href={`https://www.streamlabs.com/api/v1.0/authorize?client_id=${streamlabsClientID}&redirect_uri=${streamlabsRedirectURI}&response_type=${'code'}&scope=${streamlabsScopes}`} >Login with StreamLabs</a></td>
                <td><button onClick={()=>handleStreamLabsVerify()}>Verify</button></td>
                <td>{streamLabsVerification}</td>
                {/* <td>{localStorage.getItem('twitchVerification')}</td> */}
                </tr>
            </tbody>
            </Table>
            <div>
                <button disabled={twitchVerification!=='Verified'||streamLabsVerification!=='Verified'} onClick={()=>{history.push('/control')}}>Twitch it Up</button>
            </div>
            </div>
        </div>

    )
}

export default UserInfo