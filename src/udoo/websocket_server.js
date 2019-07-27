/*
    This script:
    - Runs a WebSocket Server on http://localhost:3000
    - Takes incoming transaction request data sent from the client (serial.js)
    - Should query account balances from blockchain and produce transaction result arrays
    - Sends transaction result data back to client
*/

/*
    Functionality still needed:
    - Integration of getting account balanconst WebSocket = require('ws')ces from blockchain, performing logic, and invoking blockchain
    to generate the transaction result data (the beef of the SDK)
    - It should not only send transaction result dconst app = require("../../app");ata back to the requesting client,
    but also to every udoo. This ensures energy sellers get their account balances updated on LCD
    - Without this functionality, seller account balances won't update on LCD until THEY request a new transaction (not good)
*/

const axios = require('axios');
const WebSocket = require('ws');
const app = require("../../app");
const server = require('http').createServer();
const tynt = require('tynt');
const wss = new WebSocket.Server({
    server: server
});

server.on('request', app);

// When server receives incoming data, print the data in terminal and send back the transaction result
wss.on('connection', function connection(ws, req) {


    ws.on('message', function incoming(message) {

        obj = JSON.parse(message)
        console.log(message)

        // QUERY
        if(obj.function == "query"){
            console.log(tynt.Green("console log: QUERY FUNCTION (from websocket_server.js"))
            axios.post('http://localhost:3000/assets', {
                iden: obj.iden,
                idres: obj.idres

            }).then(res => {
                JSON.stringify(obj);
                ws.send(parseInt(obj.source) + " " + parseInt(res.data) + " " + 0)
            })
            .catch(err => {
                console.log(err)
            })
        }

        // PRODUCE
        else if(obj.function == "produce"){
            console.log(tynt.Green("console log: PRODUCE FUNCTION (from websocket_server.js"))
            axios.post('http://localhost:3000/produce', {
                owner: obj.owner,
                ownerType: obj.ownerType,
                iden: obj.iden,
                value: obj.value,
                idres: obj.idres
            }).then(res => {
                ws.send(parseInt(obj.source) + " " + parseInt(res.data) + " " + 0)
            }).catch(err => {
                console.log(err)
            })
        }

        // CONSUME
        else if (obj.function == "consume"){
            console.log(tynt.Green("console log: CONSUME FUNCTION (from websocket_server.js)"))
            let house = obj.source;
            axios.post('http://localhost:3000/consume', {
                owner: obj.owner,
                ownerType: obj.ownerType,
                iden: obj.iden,
                value: obj.value,
                idres: obj.idres
            }).then(res => {
                // send amount consumed
                ws.send(parseInt(house) + " " + parseInt(res.data.consumed) + " " + parseInt(house))
                // send new balance
                ws.send(parseInt(house) + " " + parseInt(res.data.newBalance) + " " + 0)
                

            })
            .catch(err => {
                console.log(err)
            })
        }

        // TRADE
        else if(obj.function == "trade") {
            console.log(tynt.Green("console log: TRADE FUNCTION (from websocket_server.js)"))
            axios.post('http://localhost:3000/trade', {
                
                "tokenInc": obj.tokenInc,
                "energyInc": obj.energyInc,
                "rate": "1",
                "energyDec" : obj.energyDec,
                "value": obj.value,
                "tokenDec": obj.tokenDec,
                "function": "trade",
                "timestamp": "2019"
                
            }).then(res => {
                // send amount consumed
                ws.send(parseInt(obj.source) + " " + parseInt(res.data.amountSold) + " " + parseInt(obj.destination))

                // send new balance
                ws.send(parseInt(obj.destination) + " " + parseInt(res.data.sellerBalance) + " " + 0)
                
                switch(parseInt(obj.destination)) {
                    case 1: // House 1
                        console.log("House 1")
                        axios.post('http://192.168.1.101:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;

                    case 2: // House 2
                        console.log("House 2")
                        axios.post('http://192.168.1.102:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;

                    case 3: 
                        console.log("House 3")
                        axios.post('http://192.168.1.103:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;

                    case 4: 
                        console.log("House 4")
                        axios.post('http://192.168.1.104:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;

                    case 5: 
                        console.log("House 5")
                        axios.post('http://192.168.1.105:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;

                    case 6: 
                        console.log("House 6")
                        axios.post('http://192.168.1.106:3000/fabric', {
                            source: parseInt(obj.destination),
                            value: res.data.sellerBalance
                        })
                        .then(res => {
                            console.log("success")    
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        break;
                    default:
                        console.log("NO HOUSE " + obj.destination + "!")

                }
            })
            .catch(err => {
                console.log(err)
            })
        }

    });    
});

server.listen(3000, function() {
    console.log(tynt.Green('listening to port 3000'));
});

