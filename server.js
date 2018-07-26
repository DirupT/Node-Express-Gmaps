const express = require('express');
const config = require('./config.js');
const fetch = require('node-fetch');

const server = express();

const PLACES_API_KEY = config.placesKey;
const SEARCH_PLACE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
const SEARCH_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';

const DISTANCE_API_KEY = config.distanceKey;
const DISTANCE_MATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

server.get('/', (req, res) => {
    res.send('Home');
})

server.get('/place', (req, res) => {
    let searchQuery = req.query.search_query.split(' ').join('+');
    let searchUrl = SEARCH_PLACE_URL + searchQuery + '&key=' + PLACES_API_KEY;
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

server.get('/travel/mode', (req, res) => {
    const origins = req.query.origins;
    const destinations = req.query.destinations;
    const travelModes = ['driving', 'walking', 'bicycling', 'transit'];
    let durations = [];
    for (let i = 0; i < 4; i++) {
        const distanceUrl = DISTANCE_MATRIX_URL + 'origins=' + origins + '&destinations=' + destinations + '&mode=' + travelModes[i] + '&key=' + DISTANCE_API_KEY;
        fetch(distanceUrl)
            .then(response => response.json())
            .then(response => {
                durations.push(response.rows[0].elements[0].duration)
                if (durations.length === 4) {
                    durations = durations.reduce((prev, cur) => cur.value < prev.value ? cur : prev);
                    res.status(200).json({ travelDuration: durations.text });
                }
            })
            .catch(err => res.status(500).json({ error: "Couldn't receieve the travel details" }));
    }
})

server.listen(8001, () => console.log('Gmaps api running...'));