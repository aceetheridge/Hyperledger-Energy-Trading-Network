'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
This script will create a user for the SDK as well as invoke the createResident function onto the blockchain.

To run:
1. Make sure the SDK (node-express app) is running

2.  If running locally: 
    - Make sure the fabric containers are running (docker ps to check)
    If chaincode is running on a different machine than SDK
    - Make sure you change the environment variable to "devContainer"
    - Make sure you set all the IP's to point to the IP of the machine running the CC
    - Make sure the CC is running on the machine (./fabric.sh upAll)
    
3. In the command line (terminal) type:
    python3 createUser.py arg1

    where arg1 is the "House #"

    example:

    python3 createUser.py 1

    will create a resident with the alias "House 1"
        token id    : idtok1
        energy id   : iden1
        cash id     : idcash1
        resident id : idres1

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import requests
import json
import sys

source = sys.argv[1]



resObj = {
    "firstName": "Duke", # Defaults user name to Duke Energy
    "lastName": "Energy",
    "alias": "House " + source, # Sets alias to "House #"
    "tokens": "idtok" + source,
    "id": "idres" + source,
    "type": "Prosumer",
    "cash": "idcash" + source,
    "energy": "iden" + source
}

post = requests.post("http://localhost:3000/createUser/", json=resObj) # sets the object to send and the endpoint

print(post.text) # for debugging