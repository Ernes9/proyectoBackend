const socket = io("http://localhost:8080", {autoConnect: false});

function sendMessage(msg) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", "d-flex", "align-items-start", "justify-content-start", "mb-4");

  const innerFlexDiv = document.createElement("div");
  innerFlexDiv.classList.add("d-flex", "flex-column", "space-2", "text-sm", "max-w-xs", "mx-2", "order-2", "items-start");

  const usernameSpan = document.createElement("span");
  usernameSpan.classList.add("text-secondary", "font-weight-bold");
  usernameSpan.textContent = msg.username;
  innerFlexDiv.appendChild(usernameSpan);

  const messageContainer = document.createElement("div");
  const messageSpan = document.createElement("span");
  messageSpan.classList.add("px-4", "py-2", "rounded-lg", "d-inline-block", "border", "rounded-right-0", "bg-gray-300", "text-gray-600");
  messageSpan.textContent = msg.text;
  messageContainer.appendChild(messageSpan);
  innerFlexDiv.appendChild(messageContainer);

  messageDiv.appendChild(innerFlexDiv);

  return messageDiv;
}



function sendOwnMessage(msg) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", "d-flex", "align-items-start", "justify-content-start", "mb-4");

  const innerFlexDiv = document.createElement("div");
  innerFlexDiv.classList.add("d-flex", "flex-column", "space-2", "text-sm", "max-w-xs", "mx-2", "order-2", "items-start");

  const usernameSpan = document.createElement("span");
  usernameSpan.classList.add("text-primary", "font-weight-bold");
  usernameSpan.textContent = msg.username;
  innerFlexDiv.appendChild(usernameSpan);

  const messageContainer = document.createElement("div");
  const messageSpan = document.createElement("span");
  messageSpan.classList.add("px-4", "py-2", "rounded-lg", "d-inline-block", "border", "rounded-right-0", "bg-primary", "text-white");
  messageSpan.textContent = msg.text;
  messageContainer.appendChild(messageSpan);
  innerFlexDiv.appendChild(messageContainer);

  messageDiv.appendChild(innerFlexDiv);

  return messageDiv;
}



function onLoad(){
  const username= localStorage.getItem("username")
  if(username){
    socket.auth = {username}
  }
}


document.addEventListener("DOMContentLoaded", function () {
  onLoad();
  socket.on("historial", (msgs) => {
    console.log("Socket conectado", msgs);
    const username = localStorage.getItem("username");
      let msgHtml = "";
  
      for (const key in msgs) {
        if (msgs.hasOwnProperty(key)) {
          const msg = msgs[key];
          msgHtml += msg.username == username ? sendOwnMessage(msg) : sendMessage(msg);
        }
      }
  
      document.getElementById("messages").innerHTML = msgHtml;
  })
  
  document.getElementById("sendMsg").addEventListener("click", function () {
    const input = document.getElementById("message").value;
    document.getElementById("message").value = "";
    const user = localStorage.getItem("username");
    socket.emit("message", { username: user, text: input });

      document.getElementById("messages").appendChild(sendOwnMessage({username: user, text: input}));
  });

  document.getElementById("loginButton").addEventListener("click", () => {
      const input = document.getElementById("usernameInput").value;
      localStorage.setItem("username", input);
      console.log({ input });
      socket.auth = { username: input };
      socket.connect();
      document.getElementById("messages-container").classList.remove("hidden");
      document.getElementById("login-container").classList.add("hidden");
  });

  document.getElementById("message").addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
          const input = document.getElementById("message").value;
          document.getElementById("message").value = "";
          const user = localStorage.getItem("username");
          socket.emit("message", { username: user, text: input });

          document.getElementById("messages").appendChild(sendOwnMessage({username: user, text: input}));
      }
  });
});
