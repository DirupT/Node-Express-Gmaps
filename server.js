const express = require('express');
const config = require('./config.js');

const server = express();
const API_KEY = config.key;

server.get('/', (req, res) => {
    res.send(config.key);
})

server.listen(8001, () => console.log('Gmaps api running...'));