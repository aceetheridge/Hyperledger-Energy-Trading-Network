'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
This script will query all transactions on the blockchain.

To run:
1. Make sure the SDK (node-express app) is running

2. If running locally: 
    - Make sure the fabric containers are running (docker ps to check)
   If chaincode is running on a different machine than SDK
    - Make sure you change the environment variable to "devContainer"
    - Make sure you set all the IP's to point to the IP of the machine running the CC
    - Make sure the CC is running on the machine (./fabric.sh upAll)

3. In the command line (terminal) type:
    python3 getTransactions.py arg1

    where arg1 is the "House #"



example:

    python3 getTransactions.py 1

will list all the transactions made by House 1

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import requests
import json
import sys

source = sys.argv[1]

resObj = {
    "idres": "idres" + source, # sets the owner of the asset to "House #". This is just for clarity and has no effect on network
}

get = requests.get("http://localhost:3000/trade/", json=resObj) # endpoint
print(get.text)