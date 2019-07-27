const WebSocket = require('ws')
let socket = new WebSocket('ws://localhost:3000/');

// Serial stream comming in...
// The serial data recieved is...
//let transactionRequest = ['1', '15', '0'];
var serialObj = {
    "source": String(process.argv[2]),
    "value": String(process.argv[3]),
    "destination": String(process.argv[4])
}

if(serialObj.source == '0') {
    console.log("invalid request");
} 

// QUERY
else if(serialObj.source != '0' && serialObj.value == '0' && serialObj.destination == '0') {
    console.log("QUERY FUNCTION (socket_testing.js)")
    resObj = {
        "firstName": "admin",
        "idtok": "idtok" + serialObj.source,
        "iden": "iden" + serialObj.source,
        "idcash": "idcash" + serialObj.source,
        "idres": "idres" + serialObj.source,
        "function": "query",
        "id": serialObj.source
    }
    socket.onopen = function() {
        socket.send(JSON.stringify(resObj));
    };
}

// PRODUCE
else if(serialObj.source != '0' && serialObj.value != '0' && serialObj.destination == '0') {
    console.log("PRODUCE FUNCTION (socket_testing.js)")
    resObj = {
        "owner": "House" + serialObj.source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
        "ownerType": "Resident",
        "iden": "iden" + serialObj.source,
        "value": serialObj.value,
        "idres": "idres" + serialObj.source,
        "function": "produce",
        "source": serialObj.source
      }    
      socket.onopen = function() { 
        socket.send(JSON.stringify(resObj));
      }
}

// CONSUME
else if(serialObj.source != '0' && serialObj.value != '0' && serialObj.destination === serialObj.source){
    console.log("CONSUME FUNCTION (socket_testing.js)")
    resObj = {
        "owner": "House" + serialObj.source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
        "ownerType": "Resident",
        "iden": "iden" + serialObj.source,
        "value": serialObj.value,
        "idres": "idres" + serialObj.source,
        "function": "consume",
        "source": serialObj.source
      }   
      socket.onopen = function() { 
        socket.send(JSON.stringify(resObj));
      } 
}

// TRADE
else if(serialObj.source != '0' && serialObj.value != '0' && serialObj.destination != serialObj.source && serialObj.source != '0'){
    console.log("TRADE FUNCTION (socket_testing.js)")
    resObj = {
        "tokenInc": "idtok" + serialObj.destination,
        "energyInc": "iden" + serialObj.source,
        "rate": "1",
        "energyDec" : "iden" + serialObj.destination,
        "value": serialObj.value,
        "tokenDec": "idtok" + serialObj.source,
        "function": "trade",
        "timestamp": "2019",
        "source": serialObj.source,
        "destination": serialObj.destination
    }
      socket.onopen = function() { 
        socket.send(JSON.stringify(resObj));
      } 
}

else {
    console.log("INVALID CHOICE")
}

socket.onmessage = function(e) {
    console.log('Transaction Result: ' + e.data);
};

module.exports = {
    getData: function(data) {
        console.log("This is inside socket_testing" + data);
    }
}
