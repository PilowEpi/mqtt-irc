class Client {
    constructor(mail, nickname, description) {
        this.mail = mail;
        this.nickname = nickname;
        this.description = description;

        console.log("Client Registered : " + this.nickname);
    }

    get _nickname() { return this.nickname; }
    get _description() { return this.description; }
    get _mail() { return this.mail; }

}

class DB {
    constructor() {
        this.clientDB = []
    }

    addClientRaw(mail, nickname, description) {
        this.clientDB.push(new Client(mail, nickname, description))
    }
    
    addClient(client) {
        this.clientDB.push(client);
    }

    get clientList() { return this.clientDB; }
    get size() { return this.clientDB.length; }
    
}

module.exports =  {
    DB, Client
}