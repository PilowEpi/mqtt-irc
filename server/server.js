const express = require('express');
const app = express();
const ws = require("ws");
const { recover } = require('./mqtt.js')

const wss = new ws.Server({
    noServer: true
});

app.use("/static", express.static('./static/'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/front/index.html');
});

var server = app.listen(4242, () => {
    console.log("Server listening : http://localhost:4242");
})

wss.on('connection', (ws, rq) => {
    console.log("Connection established\n");
})

var sendItems = () => {
    var item = recover();
    
    if (item == undefined)
        return;
    console.log("Sending item : " + JSON.stringify(item));

    wss.clients.forEach((client) => {
        client.send(JSON.stringify(item));
    })
}

setInterval(sendItems, 1000);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    })
});