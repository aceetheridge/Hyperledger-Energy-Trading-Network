''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
This script will invoke queries and/or transactions onto the blockchain

To run:
1. Make sure the SDK (node-express app) is running

2. If running locally: 
    - Make sure the fabric containers are running (docker ps to check)
   If chaincode is running on a different machine than SDK
    - Make sure you change the environment variable to "devContainer"
    - Make sure you set all the IP's to point to the IP of the machine running the CC
    - Make sure the CC is running on the machine (./fabric.sh upAll)

3. In the command line (terminal) type:
    python3 invoke.py arg1 arg2 arg3

    where arg1 is the source
    where arg2 is the value
    where arg3 is the destination

    example:

    python3 invoke.py 1 0 0

        will query "House 1" account balance (tokens + energy)

    python3 invoke.py 2 100 3

        will trade 100 energy from "House 2" to "House 3"

    python3 invoke.py 1 10 0

        will consume 10 energy from "House 1"

    python3 invoke,py 3 20 3

        will produce 20 energy for "House 3"
        

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import requests
import json
import sys
from datetime import datetime

source = sys.argv[1]
value = sys.argv[2]
destination = sys.argv[3]
resObj = {}


# if source == 0
# invalid argument
# if source == '0' and value == '0' and destination == '0':
#     print("invalid arguments")

# elif source == '0':
#     print("invalid arguments")


# # if destination == 0
# # produce energy
# # update current houses energy to energy + N

# #---------------------------------------
# #-----------UNDER CONSTRUCTION----------
# #---------------------------------------
# elif source != '0' and value != '0' and destination == '0':
#     print("Consume Energy House #" + source)
#     resObj = {
#         "owner": "House" + source, # sets the owner of the asset to "House #". This is just for clarity and has no effect on network
#         "ownerType": "Resident",
#         "iden": "iden" + source,
#         "value": value,
#         "idres": "idres" + source,
#         "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:S')
#     }
#     post = requests.post("http://localhost:3000/produce/", json=resObj)
#     print(post.text)


# # if source == destination
# # consume energy
# # update current house energy to energy - N
# #---------------------------------------
# #-----------UNDER CONSTRUCTION----------
# #---------------------------------------
# elif source == destination and value != '0' and source != '0':
#     print("Produce Energy House #" + source)
#     resObj = {
#         "owner": "House" + source, # sets the owner of the asset to "House #". This is just for clarity and has no effect on network
#         "ownerType": "Resident",
#         "iden": "iden" + source,
#         "value": value,
#         "idres": "idres" + source,
#         "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:S')
#     }
#     post = requests.post("http://localhost:3000/consume/", json=resObj)
#     print(post.text)

# # if source != destination && destination != 0
# # trade energy
# elif source != destination and destination != '0' and source != '0' and value != '0':
#     print("Energy Trade House #" + source + " and House #" + destination)
#     resObj = {
#         "tokenInc": "idtok" + source,
#         "energyInc": "iden" + destination,
#         "rate": "1",
#         "energyDec" : "iden" + source,
#         "value": value,
#         "tokenDec": "idtok" + destination,
#         "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:S')
#     }
#     post = requests.post("http://localhost:3000/trade/", json=resObj)
#     print(post.text)
#     #if post.text != '-1':
#         #ph1 = requests.post("http://localhost:3000/index", post.text) # my laptop
#         # ph2 = requests.post("http://192.168.1.25:3000/fabric", post.text) # UDOO
#         # ph3 = requests.post("http://192.168.1.8:3000/fabric", post.text) # Atom notebook
#         # ph4 = requests.post("http://192.168.1.110:3000/fabric", post.text) # HP notebook
#         # print(ph1.text)
#         # print(ph2.text)
#         # print(ph3.text)
#         # print(ph4.text)

    
# # Query token house# 0 0
if source != '0' and value == '0' and destination == '0':
    print("Getting account balance for House #" + source)
    resObj = {
    "firstName": "admin",
    "idtok": "idtok" + source,
    "iden": "iden" + source,
    "idcash": "idcash" + source,
    "idres": "idres" + source
    }
    get = requests.post("http://localhost:3000/assets/", json=resObj)
    print(get.text)
    
# else:
#     print("Nothing")




