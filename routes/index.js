var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  
  // obj = JSON.stringify(req.body)
  // console.log(req.body)
  res.send("index")
})

module.exports = router;
