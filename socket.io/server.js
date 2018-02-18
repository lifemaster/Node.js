const http = require('http');
const express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
server.listen(1234, () => console.log('Server is listening on port 1234'));

// create socket.io server
const io = require('socket.io').listen(server);

// socket.io handlers and emitters
io.on('connection', socket => {
  socket.emit('ready', 'Welcome to online chat!');

  socket.on('chat', message => {
    io.emit('chat', message);
  });
});

io.on('error', err => console.log('An error has occurred: ', err));
