const express = require('express');
const config = require('./config.js');
const fetch = require('node-fetch');

const server = express();

const API_KEY = config.key;
const SEARCH_PLACE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';

server.get('/', (req, res) => {
    res.send('Home');
})

server.get('/place', (req, res) => {
    let searchQuery = req.query.search_query.split(' ').join('+');
    let searchUrl = SEARCH_PLACE_URL + searchQuery + '&key=' + API_KEY;
    console.log(searchUrl);
    res.send('Place');
})

server.listen(8001, () => console.log('Gmaps api running...'));