const constants = require('./lib/constants')
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const randomstring = require("randomstring");
const querystring = require("querystring"); 
// const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
// const spotifyApi = new SpotifyWebApi();
dotenv.config();

const corsOptions = {
  // origin: ['http://localhost:5173', 'https://accounts.spotify.com/authorize']
  origin: '*'
}

app.use(cors(corsOptions));
// app.use(express.json());

app.get('/loginurl', (req,res) => {
  const state = randomstring.generate(16);
  const url = 
    `https://accounts.spotify.com/authorize?${
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: constants.SCOPES,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
      })}`;
  res.send(url);
})

app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
  }
});

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
});