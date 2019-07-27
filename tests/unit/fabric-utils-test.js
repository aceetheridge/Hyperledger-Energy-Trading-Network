let appRoot = require('app-root-path');
let chai = require('chai')
let expect = chai.expect
process.env.ENVIRONMENT = 'local'
const fabUtil = require(`${appRoot}/src/fabric/fab-utils`)
const Client = require('fabric-client')
const CP = require(`${appRoot}/src/config/cp-local`)
const userUtil = require(`${appRoot}/src/fabric/user-utils`)

const ORD_URL="grpc://localhost:7050"
const PEER_URL="grpc://localhost:7051"
const CA_URL="http://localhost:7054"

describe('Test fabric utils', function(){
  let client;
  beforeEach(function(){
    client = Client.loadFromConfig(CP)
  })

  const proposals = [{response:{status:200}},{response:{status:200}}];
  const failedProposals = [{response:{status:400,message:'failed'}},{response:{status:400,message:'failed'}}]
  it('Test check proposal responses', function(done){
    expect(fabUtil.checkProposals(proposals).success.length).to.equals(2);
    expect(fabUtil.checkProposals(proposals).failed.length).to.equals(0);
    done();
  })
  it('Test check proposal failed responses', function(done){
    expect(fabUtil.checkProposals(failedProposals).success.length).to.equals(0);
    expect(fabUtil.checkProposals(failedProposals).failed.length).to.equals(2);
    done();
  })

})


