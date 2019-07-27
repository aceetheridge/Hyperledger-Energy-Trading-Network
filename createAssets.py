'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
This script will create assets blockchain.

To run:
1. Make sure the SDK (node-express app) is running

2. If running locally: 
    - Make sure the fabric containers are running (docker ps to check)
   If chaincode is running on a different machine than SDK
    - Make sure you change the environment variable to "devContainer"
    - Make sure you set all the IP's to point to the IP of the machine running the CC
    - Make sure the CC is running on the machine (./fabric.sh upAll)

3. In the command line (terminal) type:
    python3 createAssets.py arg1 arg2 arg3 arg4

    where arg1 is the "House #"
          arg2 is the amount of tokens
          arg3 is the amound of energy
          arg4 is the amount of cash


    example:

    python3 createAssets.py 1 10 100 1000

    will create assets for "House 1"
        token id    : idtok1
        value       : 10

        energy id   : iden1
        value       : 100

        cash id     : idcash1
        value       : 1000

        resident id : idres1

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import requests
import json
import sys

source = sys.argv[1]
tokValue = sys.argv[2]
enValue = sys.argv[3]
cashValue = sys.argv[4]

resObj = {
    "owner": "House" + source, # sets the owner of the asset to "House #". This is just for clarity and has no effect on network
    "ownerType": "Resident",
    "idtok": "idtok" + source,
    "tokValue": tokValue,
    "iden": "iden" + source,
    "enValue": enValue,
    "idcash": "idcash" + source,
    "cashValue": cashValue,
    "idres": "idres" + source
}

post = requests.post("http://localhost:3000/createAsset/", json=resObj) # endpoint
print(post.text)