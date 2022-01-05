const mqtt = require('mqtt');
const fs = require('fs');
const { DB, Client } = require('./db.js');

const host = 'localhost'
const port = '1883'
const clientId = `workshop_mqtt_server`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'workshop',
  reconnectPeriod: 1000,
})

const topics = ["workshop/ex00",
    "workshop/register",
    "workshop/+/sendMessage",
    "workshop/+/get_list",
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
            return;
        case 'workshop/register':
            registerClient(payload.toString())
            return;
        case 'workshop/receiveMessage':
            publishMessage(payload.toString())
            return;
        default:
            complexMessage(topic, payload.toString())
    }
})

// Exercice 00

function addEmailToJSON(email) {
    var msg = email.toString() + "\n"

    if (!verifyMail(email)) {
        console.error("Bad email: ", email)
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
        console.error("Bad registerClient :", data)
        return;
    }
    if (!verifyMail(new_client[0])) {
        console.error("Bad email: ", new_client[0])
        return;
    }

    var client = new Client(new_client[0], new_client[1], new_client[2])
    db.addClient(client);
    //printDb()
}

function printDb() {
    var clients = db.clientList;

    clients.forEach(client => {
        console.log(client)
    });
}

// Exercice 02

function publishList(id, list) {
    client.publish('workshop/'+ id +'/list', list);
}

function sendPrivateList(topicArray) {
    console.log("Send private list")
    if (!db.exist(topicArray[1])) {
        console.error("Bad nickname: ", topicArray[1])
        return;
    }
    publishList(topicArray[1], db.clientList.toString());
}

// Exercice 03

function publishMessage(message) {
    client.publish('workshop/receiveMessage', message);
}

function sendPrivateMessage(topicArray, message) {
    if (!db.exist(topicArray[1])) {
        console.error("Bad nickname: ", topicArray[1])
        return;
    }
    let topic = "workshop/" + topicArray[1] + "/receiveMessage"
    client.publish(topic, message);
}

function complexMessage(topic, message) {
    let data = topic.split('/');
    let len = data.length;

    if (len != 3) {
        console.error("Invalid topic: ", topic);
        return;
    }
    if (data[2] == 'get_list') {
        sendPrivateList(data);
        return;
    }
    // ex03 Task 3
    if (data[2] == 'sendMessage') {
        sendPrivateMessage(data, message);
        return;
    }
}