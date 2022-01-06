
var tasks = [{
        "title": "home",
        "color": "blue",
    },
    {
        "title": "city",
        "color": "green",
    }
];

const client = new WebSocket('ws://localhost:4242/');

client.addEventListener('open', () => {
    client.addEventListener('message', (message) => {
        initListOfTasks();
        createMessageCard(JSON.parse(message.data));
    })
});

let cardContainer;

let createMessageCard = (message) => {
    console.log(message);

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement('h5');
    title.innerText = message.sender;
    title.className = 'card-title';

    let sub = document.createElement('h6');
    sub.innerText = "from " + message.receiver;
    sub.className = 'card-subtitle mb-2 text-muted';

    let txt = document.createElement('p');
    txt.innerText = message.msg;
    txt.className = 'card-text';


    cardBody.appendChild(title);
    cardBody.appendChild(sub);
    cardBody.appendChild(txt);
    card.appendChild(cardBody);
    let element = document.getElementById('card-container');
    cardContainer.insertBefore(card, element.firstChild);
}

let initListOfTasks = () => {
    if (cardContainer) {
        document.getElementById('card-container').replaceWith(cardContainer);
        return;
    }

    cardContainer = document.getElementById('card-container');
};