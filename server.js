const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const ws = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const signalling = require('./server/signalling');

const server = http.createServer(app);

signalling(server);

app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//здесь наше приложение отдаёт статику
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

//простой тест сервера
app.get('/ping', function (req, res) {
    return res.send('pong');

});

//обслуживание html
app.get('/*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(port, () => {
   console.log(`Server start on port ${port}`);
});