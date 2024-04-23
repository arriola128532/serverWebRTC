const express = require("express"); // Import the Express framework
const http = require("http"); // Import the HTTP module
const WebSocket = require("ws"); // Import the WebSocket library
const { v4: uuidv4 } = require('uuid'); // Import the UUID library for generating unique identifiers

const app = express(); // Create an Express app
const port = 5050; // Set the port for the server
const server = http.createServer(app); // Create an HTTP server using the Express app
const wss = new WebSocket.Server({ server }); // Create a WebSocket server and attach it to the HTTP server
let users = {}; // Object to store connected users

// Function to send a message to a specific connection
const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message));
};

// Function to broadcast a message to all clients except the sender
const sendToAll = (clients, type, { id, name: userName }) => {
  Object.values(clients).forEach(client => {
    if (client.name !== userName) {
      client.send(
        JSON.stringify({
          type,
          user: { id, userName }
        })
      );
    }
  });
};

// Event: WebSocket connection established
wss.on("connection", ws => {
  // Event: Message received from a client
  ws.on("message", msg => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log("Invalid JSON");
      data = {};
    }

    const { type, name, offer, answer, candidate } = data;
    switch (type) {
      case "login":
        // Handle login message
        if (users[name]) {
          sendTo(ws, {
            type: "login",
            success: false,
            message: "Username is unavailable"
          });
        } else {
          const id = uuidv4();
          const loggedIn = Object.values(users).map(({ id, name: userName }) => ({ id, userName }));
          users[name] = ws;
          ws.name = name;
          ws.id = id;
          sendTo(ws, {
            type: "login",
            success: true,
            users: loggedIn
          });
          sendToAll(users, "updateUsers", ws);
        }
        break;
      case "offer":
        // Handle offer message
        if (users[name]) {
          sendTo(users[name], {
            type: "offer",
            offer,
            name: ws.name
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
        break;
      case "answer":
        // Handle answer message
        if (users[name]) {
          sendTo(users[name], {
            type: "answer",
            answer,
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
        break;
      case "candidate":
        // Handle candidate message
        if (users[name]) {
          sendTo(users[name], {
            type: "candidate",
            candidate
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
        break;
      case "leave":
        // Handle leave message
        sendToAll(users, "leave", ws);
        break;
      default:
        // Handle unknown command
        sendTo(ws, {
          type: "error",
          message: "Command not found: " + type
        });
        break;
    }
  });

  // Event: WebSocket connection closed
  ws.on("close", function() {
    delete users[ws.name];
    sendToAll(users, "leave", ws);
  });

  // Send an initial connection message to the client
  ws.send(
    JSON.stringify({
      type: "connect",
      message: "Well hello there, I am a WebSocket server"
    })
  );
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Signaling Server running on port: ${port}`);
});