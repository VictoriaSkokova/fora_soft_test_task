const express = require('express');
const app = express();
const http = require('http');
const ws = require('ws');
const cors = require('cors');
const port = process.env.PORT || 8080;
const signalling = require('./server/signalling');

const server = http.createServer(app);

signalling(server);

app.use(cors({credentials: true, origin: true}));

app.get('/', (req, res) => {
    res.send('App works');
})

server.listen(port, () => {
   console.log(`Server start on port ${port}`);
});