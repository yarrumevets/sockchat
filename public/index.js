window.onload = () => {
  var elementChatLog = document.getElementById("chat-log");
  var elementInputText = document.getElementById("input-text");
  var elementSubmitButton = document.getElementById("submit-button");

  // Add text to the chat log.
  function addMessage(dataUsername, dataMessage, dataTimestamp) {
    var elemNewMessage = document.createElement("p");
    var elemUserName = document.createElement("span");
    elemUserName.classList.add("chat-text-user");
    var elemMessageText = document.createElement("span");
    elemMessageText.classList.add("chat-text-message");
    var elemTimestamp = document.createElement("span");
    elemTimestamp.classList.add("chat-text-timestamp");
    elemUserName.innerHTML = dataUsername;
    elemMessageText.innerHTML = dataMessage;
    elemTimestamp.innerHTML = dataTimestamp;
    elemNewMessage.appendChild(elemUserName);
    elemNewMessage.appendChild(elemMessageText);
    elemNewMessage.appendChild(elemTimestamp);
    elementChatLog.appendChild(elemNewMessage);
  }

  // Connect to server.
  const host = window.location.hostname;
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  const connection = new WebSocket(`${protocol}://${host}/sockchatsock`); // wss://localhost/sockchatsock
  connection.onopen = () => {
    addMessage(
      "Connected to server...",
      "",
      new Date(Date.now()).toUTCString()
    );

    // Send a ping to the client every 50 seconds to keep the connection alive.
    // ! Make sure this number (ms) is less than the value set for proxy_read_timeout (sec * 1000) in nginx.conf, default 60s.
    const keepAliveInterval = setInterval(() => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify({ type: "ping" }));
      }
    }, 50000); // 50 seconds. Assumes nginx default proxy_read_timeout of 60 seconds

    connection.onclose = () => {
      // Necessary when the app can function after the connection is closed.
      clearInterval(keepAliveInterval);
    };

    connection.onclose = (e) => {
      console.log(
        "\uD83D\uDC94 WEBSOCKET CONNECTION HAS CLOSED \uD83D\uDC94",
        e
      );
    };
  };

  // Receive update from server.
  connection.onmessage = (message) => {
    var data = JSON.parse(message.data);
    // Catch pong responses for keep alive mechanism.
    if (data.type === "pong") {
      console.log("Pong!"); // Uncomment to monitor keepalive.
      return;
    }
    console.log("message: ", data);
    addMessage(data.user, data.message, data.timestamp);
  };
  // Send message to server.
  elementSubmitButton.onclick = () => {
    var messageText = elementInputText.value;
    const message = JSON.stringify({ messageText, type: "" });
    connection.send(message);
    elementInputText.value = "";
  };
};
