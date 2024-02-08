// Webserver
var express = require("express");
// Chat server
const WebSocket = require("ws");

// Webserver
var app = express();
const port = 4322;
// Chat server
const websocketServer = new WebSocket.Server({ port: 5999 });
const sockets = [];
let guestCount = 1;

// Run webserver. Serve HTML, CSS, and JS files.
app.use("/", express.static(__dirname + "/public"));
app.listen(port, () => {
  console.log("Webserver on port ", port);
});

// Chat server.
websocketServer.on("connection", (websocket) => {
  websocket.guestId = "guest" + guestCount;
  guestCount += 1;
  sockets.push(websocket);
  websocket.on("message", (message) => {
    sockets.forEach((sock) => {
      const now = Date.now();
      const timeStamp = new Date(now).toUTCString();
      const newMessage = JSON.stringify({
        timestamp: timeStamp,
        user: websocket.guestId,
        message: message,
      });
      sock.send(newMessage);
    });
  });
});
