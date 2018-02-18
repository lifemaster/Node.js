const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();

app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
server.listen(1234, () => console.log('Server is listening on port 1234'));

const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', ws => {
  ws.send('Welcome to online chat!');

  ws.on('message', message => {
    if (message === 'exit') {
      return ws.close();
    }

    webSocketServer.clients.forEach(client => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('error', err => {
    console.log('An error has occurred: ', err);
  })
});
