require('dotenv').config();
let winston = require('./winston')
let log = winston.getLogger(module);
let config = require('./config')
let CP = config.CP
// let CP = 'cp-docker.json'

let CHANNEL = {
    "chanName":"foo",
    "ccName":"defaultcc",
    "ccVer":"v1"
};

module.exports =  {CP, CHANNEL};