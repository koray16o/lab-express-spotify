require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', async (req, res) => {
  //const music = await SpotifyWebApi.get();
  res.render('index');
});

app.get('/artist-search', async (req, res) => {
  //const artist = await SpotifyWebApi.get(req.params.id);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const artists = data.body.artists.items;
      console.log(artists[0]);
      res.render('artist-search-results', { artists });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
  //The same code as above but with async/await, it is better to use this way:
  /* const result = await spotifyApi.searchArtists(req.query.artist)
    const artists = result.body.artists.items
    res.render('artist-search-results', {artists}) */
});

app.get('/albums/:id', async (req, res) => {
  const result = await spotifyApi.getArtistAlbums(req.params.id);
  const albums = result.body.items;
  console.log(albums);
  res.render('albums', { albums });
});

app.get('/tracks/:id', async (req, res) => {
  const result = await spotifyApi.getAlbumTracks(req.params.id);
  const tracks = result.body.items;
  console.log(tracks);
  res.render('tracks', { tracks });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
