let appRoot = require('app-root-path');
let logger = require(`${appRoot}/src/config/winston`).getLogger(module);
const Client = require('fabric-client')
const util = require('util');


function init(cp){
    if(!ORGS){
        ORGS = Client.loadFromConfig(cp);
    }
}

module.exports.getOrg =function(cp){
    init(cp)
    return ORGS
};

//TODO
/** This should check against chaincode policies
 * **/
function checkProposals(proposals){
    let successfulResp =[];
    let failed = [];

    proposals.map((proposalResp) =>{
        if(proposalResp.response){
            if(proposalResp.response.status === 200) {
                logger.debug("Proposal response: "+JSON.stringify(proposalResp))
                successfulResp.push(proposalResp);
            }else{
                let msg = "Proposal response failed:"+proposalResp.response.message
                logger.warn(msg);
                failed.push(proposalResp)
            }
        }
    });
    return {success: successfulResp,
            failed: failed}
}

function queryChaincode(fcn, args, ccId, ccVer, client, channelName){

    let channel = client.getChannel(channelName);
    logger.info("Query on Channel:"+channel);
    let txID = client.newTransactionID();
    let transientMap = false

    const request = {
        chaincodeId: ccId,
        fcn : fcn,
        args : args,
        txId :txID,
    };
    logger.debug('query request :'+JSON.stringify(request))

    return channel.queryByChaincode(request)
        .then((response_payload) =>{
            let payload = [];
            if(response_payload){
                for(let i = 0; i < response_payload.length; i++){
                    if(transientMap){
                        //TODO check transaction tm if tm is used
                        let tm = response_payload[i].toString();
                        tm = transientMap[Object.keys(transientMap)[0]].toString();
                    }else{
                        logger.debug('Response from:'+response_payload[i])
                      if(response_payload[i] instanceof Error){
                        logger.error("Payload error ")
                        throw new Error(response_payload[i])
                      }
                        payload.push(response_payload[i].toString('utf8'));
                    }
                }
            }else{
                let m = 'Failed to get response on query'
                logger.error(m);
                throw new Error(m);
            }
            return payload
        }, (err) =>{
            logger.error(err)
            return err
        })
      .catch(err=>{
          logger.error(err)
          throw err
      })
}


//Invoke assumes has already been initialized with store and user
//context should have network
//TODO invoke should take a list of peers to invoke on to satisfy endorsement policy
function invokeChaincode(fcn, args, ccId, ccVer, client, channelName ){

    logger.debug('Invoking chaincode: '+fcn+ " args: "+args);
    Client.setConfigSetting('request-timeout', 60000);//?

    let channel = client.getChannel(channelName);

    logger.info("Invoke Channel:"+channel)
    let txID = client.newTransactionID();

    const request = {
        chaincodeId: ccId,
        fcn : fcn,
        args : args,
        txId :txID,
    };
    logger.debug('Invoke request: '+request)
    let successProposals = [];
    let failedProposals = [];

    //TODO create function to initialize channel with context

    return channel.sendTransactionProposal(request, 90000)
        .then((results) =>{
            //check results of proposals
            //event should check at this point
            //TODO create function to check responses based on endorsement policy
            const proposalResponses = results[0];
            const proposal = results[1];
            let checkedProposals = checkProposals(proposalResponses)
            successProposals = checkedProposals.success;
            failedProposals = checkedProposals.failed;

            //check all r/w sets to ensure all peers got the same results
            let all_good = channel.compareProposalResponseResults(proposalResponses)

            if(all_good){
                //send off good proposal to orderers to get broadcasted
                logger.debug("Sending off proposalResponses, ALL GOOD")
                logger.debug(util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s"', proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload));
                const request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal
                };

                //TODO implement eventhub
                return broadcast(channel, request)
            }else{
                let m = 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                logger.error(m)
                throw new Error(m);
            }
        }).then(()=>{
          return txID._transaction_id
        })
        .catch(err=>{
            logger.error(err.message)
            throw err
      })
}

function broadcast(channel, proposalResponses){
    return channel.sendTransaction(proposalResponses)
        .then((response)=>{
            if(response.status === 'SUCCESS'){
                logger.debug("Successfully send transaction to order");
                // channel.close();
                return response;
            } else {
                let m = 'Failed to order the transaction. Error code: ' + response.status +' message:'+response.message
                logger.error(m);
                throw new Error(m);
            }
        }, (err) => {
            let m = 'Failed to send transaction due to error: ' + err.stack ? err.stack : err
            logger.error(m)
            throw new Error(m);
        })
      .catch(err=>{
          logger.error(err)
          throw err
      })
}


module.exports.invokeChaincode = invokeChaincode
module.exports.queryChaincode = queryChaincode
module.exports.checkProposals = checkProposals