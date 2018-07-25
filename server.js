const express = require('express');
const config = require('./config.js');
const fetch = require('node-fetch');

const server = express();

const API_KEY = config.key;
const SEARCH_PLACE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
const SEARCH_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';

server.get('/', (req, res) => {
    res.send('Home');
})

server.get('/place', (req, res) => {
    let searchQuery = req.query.search_query.split(' ').join('+');
    let searchUrl = SEARCH_PLACE_URL + searchQuery + '&key=' + API_KEY;
    fetch(searchUrl)
        .then(response => response.json())
        .then(response => {
            let detailsUrl = SEARCH_DETAILS_URL + response.results[0].place_id + '&key=' + API_KEY;
            fetch(detailsUrl)
                .then(response => response.json())
                .then(response => res.status(200).json(response.result))
                .catch(err => res.status(500).json({ error: "Couldn't receive the place details." }));
        })
        .catch(err => res.status(500).json({ error: "Couldnt receive the place details" }));
})

server.listen(8001, () => console.log('Gmaps api running...'));