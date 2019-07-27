let appRoot = require('app-root-path')
let fabService = require(`${appRoot}/src/fabric/fabric-interface`)
process.env.ENVIRONMENT = 'local'
process.env.FABRIC_LOCAL_CP = 'cp-local.json'
let chai = require('chai')
let expect = chai.expect
let random = require('randomstring')
const constants = require('./../../src/constants')

const testUser = "test"
const randomUser = testUser+random.generate()

describe('Testing end2end with network', function(){

 it('Create User', function(done){
   fabService.makeUser(randomUser, 'defaultpw')
       .then((user) =>{
         expect(user.getName()).to.equals(randomUser);
         done()
       })
 })

 it('Invoke chaincode', function(done){
   //create args
   let resObj = {
     firstName: "junkName",
     lastName: "lastJunk",
     alias: "alskdj",
     tokens: "alksjd",
     id: "res123",
     type: "PROSUMER",
     cash: "alksdj",
     energy: "alksdj"
   };
   let args = ["res123", JSON.stringify(resObj)];
   fabService.invoke(randomUser, constants.createResident,  args)
       .then((txID) =>{
         expect(txID).to.match(/^([A-Fa-f0-9]{64})$/);
         done()
       })
 })

 it('Query created resident', function(done){
   fabService.query(randomUser, constants.getResident, ["res123"])
       .then((res) =>{
         res = JSON.parse(res)
         expect(res.firstName).to.equals('junkName')
         done()
       })
 })
})  