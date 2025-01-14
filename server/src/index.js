import { SCOPES } from '../lib/constants';
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const port = process.env.PORT;
// const spotifyApi = new SpotifyWebApi();
dotenv.config();


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

app.use(cors())

app.get('/login', (req,res) => {

  res.redirect(spotifyApi.createAuthorizeURL(scopes));


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

    // do we need to send this?? or just keep it in the backend
    res.json({
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token'],
      expiresIn: data.body['expires_in']
    })

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    // perhaps set an intervbal to refresh the token after an hour
  })
  .catch((err) => {
    console.log('Something went wrong!', err);
    res.sendStatus(400)
  });


})


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});