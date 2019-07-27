var express = require('express');
var router = express.Router();
let data = require('../src/udoo/serial.js').getData;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  
  obj = JSON.stringify(req.body)
  console.log("Fabric route")
  data(obj);
  res.send("success");
})

module.exports = router;
