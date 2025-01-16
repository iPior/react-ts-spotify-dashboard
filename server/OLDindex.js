const constants = require('./lib/constants')
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
// const spotifyApi = new SpotifyWebApi();
dotenv.config();


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});
const corsOptions = {
  // origin: ['http://localhost:5173', 'https://accounts.spotify.com/authorize']
  origin: '*'
}

app.use(cors(corsOptions));
// app.use(express.json());

app.get('/loginurl', (req,res) => {
  const url = spotifyApi.createAuthorizeURL(constants.SCOPES)
  res.send(url);
})

app.get('/callback', (req,res) => {
  const error = req.query.error
  const code = req.query.code
  // const state = req.query.state
  
  if (error){
    console.log(error)
    res.send(error)
    return;
  }
  
  spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    
    const expiration = data.body['expires_in'];
    console.log(data.body['expires_in']);

    // perhaps set an intervbal to refresh the token after an hour
    setInterval(async() => {
      console.log("in set interval")
        const data = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    },(500));
    
    res.redirect("http://localhost:5173/dashboard")
  })
  .catch((err) => {
    console.log('Something went wrong in /callback!', err);
    res.sendStatus(400)
  });
})

app.get('/tokens', (req, res) => {
  res.json({
      accessToken: spotifyApi.getAccessToken(),
      refreshToken: spotifyApi.getRefreshToken(),
  })
})

app.get('/refresh', (req, res) => {
  spotifyApi.refreshAccessToken()
  .then(data => {
    console.log('The access token has been refreshed!');
    spotifyApi.setAccessToken(data.body['access_token']);
    // send this acces token back
  })
  .catch((err) => {
    console.log('Could not refresh access token', err);
  });
})

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
});