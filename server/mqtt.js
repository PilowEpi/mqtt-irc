const mqtt = require('mqtt');
const fs = require('fs');
const { DB, Client } = require('./db.js');

const host = 'localhost'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'workshop',
  reconnectPeriod: 1000,
})

const topics = ["workshop/ex00",
    "workshop/ex01"
];

var db = new DB;

console.log("\n=== MQTT API Connection ===\n")

client.on('connect', () => {
  console.log('Connected')
  topics.forEach(topic => {
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
  });
})

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    switch (topic) {
        case 'workshop/ex00':
            addEmailToJSON(payload.toString())
        case 'workshop/ex01':
            registerClient(payload.toString())
    }
})

// Exercice 00

function addEmailToJSON(email) {
    var msg = email.toString() + "\n"

    if (!verifyMail(email)) {
        console.log("Bad email: ", email)
        return;
    }
    fs.appendFile('email.txt', msg, function (err) {
        if (err) throw err;
    });
}

function verifyMail(email) {
    return (email.split('@')[1] === "epitech.eu")
}

// Exercice 01

function registerClient(data) {
    var new_client = data.split('/')

    if (new_client.length != 3) {
        console.log("Bad registerClient :", data)
        return;
    }
    if (!verifyMail(new_client[0])) {
        console.log("Bad email: ", new_client[0])
        return;
    }

    var client = new Client(new_client[0], new_client[1], new_client[2])
    db.addClient(client);
    printDb()
}

function printDb()
{
    var clients = db.clientList;

    clients.forEach(client => {
        console.log(client)
    });
}