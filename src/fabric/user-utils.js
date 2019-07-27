require('dotenv').config()
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/src/config/winston`).getLogger(module);
const User = require('fabric-client/lib/User.js');
const Client = require('fabric-client')
const admin = process.env.CA_ADMIN || 'admin';
const adminpw = process.env.CA_PW || 'adminpw';

function getUser(username, client){
    return client.getUserContext(username, true)
        .then((user) =>{
            if(user === null){
                logger.warn('User in store not found')
                throw new Error('User in store not found '+username)
            }
            logger.debug('Found user : '+user.getName())
            return user
        })
}

function makeUser(username,password){
    return {username: username, password: password}
}

function getRegisterRequest(username, password){
    let roles = ['client'];
    let affiliation = "org1.department1";
    return {
        enrollmentID: username,
        enrollmentSecret : password,
        roles: roles,
        affiliation: affiliation
    };
}

module.exports.getRegisterRequest = getRegisterRequest;

function getCACred(){
    return {
        username: admin,
        password: adminpw,
    };
}

module.exports.getCACred = getCACred;

//Able to create user and store user in store
//Requires a client that has store initialized
//Returns user object
function createUser(client, username, password){
    //TODO get admin user from env
    const newMember = new User(username)
    logger.debug('Created new User obj:'+newMember)

    let copService = client.getCertificateAuthority();

    let regReq = getRegisterRequest(username, password);

    return client.setUserContext(getCACred())
        .then((adminUser) =>{
            logger.debug('Admin user: '+adminUser)
            return copService.register(regReq, adminUser)
        }).then((secret) =>{
            let enrollReq = {
                enrollmentID: username,
                enrollmentSecret : secret
            }
            newMember._enrollmentSecret = secret;
            logger.debug('enrollment sucuessful secret:'+enrollReq)
            return copService.enroll(enrollReq)
        }).then((enrollment) =>{
            newMember.setRoles(regReq.roles);
            newMember.setAffiliation(regReq.affiliation);
            logger.debug('enrollment sucuessful enrollment:'+enrollment)
            return newMember.setEnrollment(enrollment.key, enrollment.certificate, client.getMspid())
        }).then((() =>{
            logger.info("created user :"+newMember)
            return client.setUserContext(newMember, false)
        })).catch((err) =>{
            logger.error("Failed to create user!")
            logger.error(err)
            throw err
        })
}



module.exports.makeUser = makeUser
module.exports.createUser = createUser
module.exports.getUser = getUser
