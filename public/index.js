window.onload = function () {
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
  connection.onopen = function () {
    addMessage(
      "Connected to server...",
      "",
      new Date(Date.now()).toUTCString()
    );
  };

  // Receive update from server.
  connection.onmessage = function (message) {
    var data = JSON.parse(message.data);
    addMessage(data.user, data.message, data.timestamp);
  };

  // Send message to server.
  elementSubmitButton.onclick = function () {
    var message = elementInputText.value;
    connection.send(message);
    elementInputText.value = "";
  };
};
