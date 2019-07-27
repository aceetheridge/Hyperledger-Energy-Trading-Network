let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.post("/", (req, res) => {
    let resident = req.body
    let token = {}
    let energy = {}

    // Query resident token balance
    fabService.query("admin", constants.getResident,[resident.idres])
    .then(payload => {
        token = JSON.parse(payload)
    })
    .then(() => {
        res.send("Resident Token Balance: " + token.value + 
        "\nResident Energy Balance: " + energy.value);
    })
    .catch((err) => {
        res.send(err);
    })
});


router.get("/", (req, res) => {
    res.send("Ack");
});

module.exports = router;
