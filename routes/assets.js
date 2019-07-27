let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.post("/", (req, res) => {
    let resident = req.body
    
    // Query resident token balance
    fabService.query("admin", constants.getEnergy,[resident.iden])
    // Promise to return payload
    .then(payload => {
        res.send(JSON.parse(payload).value)
       
    })
    .catch((err) => {
        res.send(err);
    })
});


router.get("/", (req, res) => {
    res.send("Ack");
});

module.exports = router;
