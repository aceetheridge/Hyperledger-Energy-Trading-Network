require('dotenv').config();
var CP;

if(process.env.ENVIRONMENT === 'local'){
  CP = process.env.FABRIC_LOCAL_CP || 'cp-local.json'
}else if(process.env.ENVIRONMENT === 'devContainer'){
  CP = process.env.FABRIC_DOCKER_CP || 'cp-docker.json'
}
console.log(CP);
module.exports = { CP:CP};
