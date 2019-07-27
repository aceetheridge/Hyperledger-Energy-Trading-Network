/*  
    This script: 
    - Receives a transaction request via serial port from the Arduino
    - Prints and organizes the data in a terminal
    - Sends the transaction request to a WebSocket Server on localhost:3000
    - Receives a transaction result from the Websocket Server
    - Sends the result back to the serial port as a string to the Arduino
*/

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');
const WebSocket = require('ws')
const tynt = require('tynt')
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const emitter = new EventEmitter();


port.on("open", () => {
    console.log(tynt.Blue('Serial port /dev/ttyACM0 is open\n'));
  });
  
// Display "New Transaction Request" when new serial data is received
emitter.on('newTransactionRequest', function(){
  console.log(tynt.Blue('New Transaction Request\n'));
});

// Read the serial data on the port
parser.on('data', data =>{
  const socket = new WebSocket('ws://localhost:3000/')
  const socket2 = new WebSocket('ws://localhost:3000/fabric')
  console.log(tynt.Blue('Data received on serial port: ' + data));



  // Split data string in to an array to print nice stuff in the terminal
  var transactionRequest = data.split(' ');

  let source = transactionRequest[0].toString();
  let value = transactionRequest[1].toString();
  let destination = transactionRequest[2].toString();
  destination = parseInt(destination);

  //-------------START LOGIC--------------------------

  if(source == 0) {
    console.log(tynt.Blue("invalid request, no house 0"));
  }

  // Query asset balances
  else if(source != 0 && value == 0 && destination == 0) {
    console.log(tynt.Yellow("Query function (serial.js)"))
    resObj = {
      "firstName": "admin",
      "idtok": "idtok" + source,
      "iden": "iden" + source,
      "idcash": "idcash" + source,
      "idres": "idres" + source,
      "function": "query",
      "source": source
    }
    
    socket.onopen = function() { 
      socket.send(JSON.stringify(resObj));
    }

  }

  // Produce function
  else if(source != 0 && value != 0 && destination == 0) {
    console.log(tynt.Green("Produce function (serial.js)"))
    resObj = {
      "owner": "House" + source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
      "ownerType": "Resident",
      "iden": "iden" + source,
      "value": value,
      "idres": "idres" + source,
      "function": "produce",
      "source": source
    }    
    socket.onopen = function() { 
      socket.send(JSON.stringify(resObj));
    }
  }




    // Trade function
    else if(source != 0 && value != 0 && parseInt(destination) != parseInt(source)) {
      console.log(tynt.Red("Trade function (serial.js)"))
      resObj = {
        "tokenInc": "idtok" + destination,
        "energyInc": "iden" + source,
        "rate": "1",
        "energyDec" : "iden" + destination,
        "value": value,
        "tokenDec": "idtok" + source,
        "function": "trade",
        "timestamp": "2019",
        "source": source,
        "destination": destination
    }
      socket.onopen = function() { 
        socket.send(JSON.stringify(resObj));
      }  
    }



    // Consume function
    else{
      console.log(tynt.Red("Consume function (serial.js)"))
      resObj = {
        "owner": "House" + source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
        "ownerType": "Resident",
        "iden": "iden" + source,
        "value": value,
        "idres": "idres" + source,
        "function": "consume",
        "source": source
      }    
      socket.onopen = function() { 
        socket.send(JSON.stringify(resObj));
      }
    }
  // Send transaction request data to the Websocket Server
  socket.onmessage = function(e) {
  console.log('Transaction Result: ' + e.data + '\n');
  port.write(e.data + '\n');
  }

  // Trigger event for new data requests received on the serial port
  emitter.emit('newTransactionRequest');
  
});

module.exports = {
  getData: function(data) {
      console.log("from serial.js: " + data);
      dataObj = JSON.parse(data);

      console.log(dataObj.source + " " + dataObj.value + " 0")
      port.write(dataObj.source + " " + dataObj.value + " 0" + '\n');
  }
}