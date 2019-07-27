const app = require("../../app");
const http = require('http').Server(app);
const io = require('socket.io')(http);
var express = require('express');
var router = express.Router();

app.io = io;


router.post('/socket', (req, res) => {

    req.app.io.emit('tx')
})

io.on('connection', socket => {
    console.log("user connected: " + socket.client.id);
    socket.on('serverEvent', data => {
        console.log('new message from client: ' + data);
    })

    socket.emit('clientEvent', "hey");
})

http.listen(3000, () => {
    console.log("listening to port 3000");
})


module.exports = router;