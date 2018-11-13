#!/usr/bin/env node
socket = require('socket.io');

let port = parseInt(process.argv[2] || 8300);
let io = socket(port);
io.on('connect', socket => {
    socket.on('message', function (data) {
        io.emit('dmk', data)
    });
});
console.log('listening on port ' + port);