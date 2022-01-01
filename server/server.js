const express = require('express');
const app = express();

const mqttAPI = import('./mqtt.js')

app.listen(4242, () => {
    console.log("Server listening : http://localhost:4242");
})