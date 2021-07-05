const WebSocket = require("ws");

const websocketServer = new WebSocket.Server({ port: 5999 });

const sockets = [];

let guestCount = 1;

websocketServer.on("connection", (websocket) => {
  websocket.guestId = "guest" + guestCount;
  guestCount += 1;
  sockets.push(websocket);
  console.log("Sockets: ", sockets.length);
  websocket.on("message", (message, foo) => {
    console.log("FOOOO", websocket.guestId);
    console.log(`Received message => ${message}`);
    // websocket.send("received!");
    console.log("message : : : ", message);
    sockets.forEach((sock) => {
      sock.send(Date.now() + ") " + websocket.guestId + ": " + message);
    });
  });
});
