
let appRoot = require('app-root-path');
const Client = require('fabric-client');
const userUtil = require('./user-utils');
const fabUtil = require('./fab-utils');
const fabConfig = require(`${appRoot}/src/config/fabric-config`);
const CP = fabConfig.CP;
const CHAN = fabConfig.CHANNEL;
let logger = require(`${appRoot}/src/config/winston`).getLogger(module);

let client = Client.loadFromConfig(`${appRoot}/src/config/${CP}`);

exports.query = function(user, fcn, args){
  //TODO check if user is registered
  logger.debug("User "+user+" Query "+fcn+" with args "+args);
  return client.initCredentialStores()
      .then(()=>{
        return userUtil.getUser(user, client)
      }).then((user) =>{
        logger.debug("Got user :"+user.getName());
        return client.setUserContext(user)
      }).then((user)=>{
        logger.debug("Set user context: "+user.getName());
        logger.debug("Query : "+fcn+","+CHAN.ccVer+","+CHAN.ccName);
        return fabUtil.queryChaincode(fcn, args, CHAN.ccName, CHAN.ccVer, client, CHAN.chanName)
      }).then((payload)=>{
        logger.debug("Query Successful with payload"+payload)
        return payload
      }, err =>{
        logger.error("query error : "+err);
        
        throw new Error(err.message)
        
      })
};

exports.invoke = function(user, fcn, args){
  logger.debug("User "+user+" Invoking "+fcn+" with args "+args);
  //TODO check if user is registered
  return client.initCredentialStores()
      .then(()=>{
        logger.debug("Initializing store")
        return userUtil.getUser(user, client)
      }).then((user)=>{
        logger.debug("Got user :"+user.getName());
        return client.setUserContext(user)
      }).then((user)=>{
        logger.debug("Set user context: "+user.getName());
        logger.debug("Invoking : "+fcn+","+CHAN.ccVer+","+CHAN.ccName);
        return fabUtil.invokeChaincode(fcn, args, CHAN.ccName, CHAN.ccVer, client, CHAN.chanName)
      }).then((txId) =>{
        logger.info("Invoke successful with txId: "+txId);
        return txId;
      }).catch((err) =>{
        logger.error("Invoke error : "+err);
        throw err
      })
};

exports.makeUser = function(username, password){
  logger.debug("Creating user :"+username+" with secret "+password);
  return client.initCredentialStores()
      .then(()=>{
        return userUtil.createUser(client, username, password)
      })
      .then((newUser) =>{
        logger.debug("Successfully created user:"+newUser.getName());
        return newUser
      }).catch(err =>{
        logger.error("Error creating user:"+err);
        throw new Error(err.message)
      })
};


