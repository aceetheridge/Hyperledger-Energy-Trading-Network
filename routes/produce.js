let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

router.get("/", (req, res) => {
    res.send("Under construction...")
});

router.post("/", (req, res) => {
    
    let resident = req.body;

    // Query the current energy balance for the resident
    fabService.query("admin", constants.getEnergy,[resident.iden])
    .then(payload => {

        // Convert to integers
        energy = JSON.parse(payload)
        currentBalance = parseInt(energy.value)
        produced = parseInt(resident.value);
        newBalance = currentBalance + produced;
        
        //-----Debugging-----------
        // console.log(energy)
        // console.log("Current balance: " + currentBalance)
        // console.log("Produced: " + produced)
        // console.log(newBalance)
        //--------------------------
    })
        .then(() => {
            // Make resident obj for args
            resObj = {
                owner: resident.owner,
                ownerType: resident.ownerType,
                id: resident.iden,
                // updated energy value
                value: JSON.stringify(newBalance)
                }  
        })
        .then(() => {
            // Invoke to CC
            let args = [resident.idres, JSON.stringify(resObj)];
            fabService.invoke("admin", constants.createEnergy, args)
            .then(() => {
                res.send(resObj.value)
            })
            .catch(err => {
                res.send(err)
            })
        })

    .catch(err => {
        res.send(err)
    })
});

module.exports = router;
