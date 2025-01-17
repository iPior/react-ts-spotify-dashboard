const constants = require('./lib/constants')
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
dotenv.config();

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});
const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions));

app.get('/loginurl', (req,res) => {
  console.log("made it to /loginurl")
  const url = spotifyApi.createAuthorizeURL(constants.SCOPES)
  res.send(url);
})

app.get('/callback', (req,res) => {
  console.log("made it to /callback")
  const error = req.query.error
  const code = req.query.code
  
  if (error){
    console.log(error)
    res.send(error)
    return;
  }
  
  spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    console.log("token granted")
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    
    const expiration = data.body['expires_in'];
    console.log(data.body['expires_in']);
    
    res.redirect("http://localhost:5173/dashboard")
  })
  .catch((err) => {
    console.log('Something went wrong in /callback!', err);
    res.sendStatus(400)
  });
})

app.get('/tokens', (req, res) => {
  console.log("made it to /tokens")
  res.json({
      accessToken: spotifyApi.getAccessToken(),
      refreshToken: spotifyApi.getRefreshToken(),
  })
})

app.get('/refresh', (req, res) => {
  console.log("made it to /refresh")
  spotifyApi.refreshAccessToken()
  .then(data => {
    console.log('The access token has been refreshed!');
    spotifyApi.setAccessToken(data.body['access_token']);
    res.json({
      accessToken: data.body['access_token']
    })
  })
  .catch((err) => {
    console.log('Could not refresh access token', err);
  });
})

app.get('/getdata', (req,res) => {
  console.log("made it to /getdata")
  spotifyApi.getMe()
  .then(function(data) {
    res.json({
      displayName: data.body.display_name,
      profilePic: data.body.images[0].url
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.get('/clear', (req,res) => {
  console.log("made it to /clear")
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
})

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
});