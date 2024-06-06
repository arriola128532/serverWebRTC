const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

// Redirigir las solicitudes WebSocket seguras a no seguras
server.on('upgrade', (request, socket, head) => {
  if (request.headers['sec-websocket-protocol'] === 'wss') {
    const target = 'ws://localhost:8080/';
    const proxy = new WebSocket(target);
    proxy.on('open', () => {
      proxy.send(head);
      proxy.send(request);
      socket.pipe(proxy).pipe(socket);
    });
    proxy.on('error', (err) => {
      console.error('Error en la conexión proxy:', err);
      socket.destroy();
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});
