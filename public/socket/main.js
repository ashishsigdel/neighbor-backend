// const socket = io({
//   auth: {
//     token: "123",
//     username: "test",
//   },
// });

// socket.on("connect", () => {
//   console.log("Connected");
// });

// socket.on("connect_error", (err) => {
//   console.log(err.message); // prints the message associated with the error
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected");
// });

// socket.on("error", (error) => {
//   console.log(error);
//   socket.disconnect();
// });

// socket.on("message", (message, id, date) => {
//   console.log(message);
//   const messages = document.getElementById("messages");

//   if (socket.id !== id) {
//     messages.innerHTML += `<p>${message} - ${id} - ${date}</p>`;
//   }
// });

// document.getElementById("send").addEventListener("click", () => {
//   const message = document.getElementById("message").value;
//   socket.emit("message", message);
// });

// //emit typing event if user is typing
// document.getElementById("message").addEventListener("keypress", () => {
//   socket.emit("typing", "User is typing...");
// });

// //listen for typing event
// socket.on("typing", (message) => {
//   const typing = document.getElementById("typing");
//   typing.innerHTML = message;
// });

const handleJoin = (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;

  if (!username) {
    alert("Please enter a username");
    return;
  }

  const socket = io({
    auth: {
      token:
        "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZXMiOlt7InRpdGxlIjoidXNlciJ9XSwicmZJZCI6NjksImlhdCI6MTcwMzQwNzc2MywiZXhwIjoxNzAzNDA4NjYzLCJpc3MiOiJDaGhpbWVrZWUifQ.xp_ZFGLMbLXAVERIUTnS2U46zGUApk0VXEuLGY1IJ79Zl8AX-ncroO-LB5qzIsDGDmAwGkAIDH3oHmRrpCyCTw",
    },
  });

  //store username in local storage
  localStorage.setItem("username", username);

  socket.on("connect", () => {
    console.log("Connected");
    console.log(socket.id);

    //hide join form
    document.getElementById("join-form").style.display = "none";
  });

  // handle error
  socket.on("connect_error", (err) => {
    console.log(JSON.parse(err.message));
  });

  //receive message
  socket.on("message", (payload) => {
    console.log("New Message", payload);
  });

  socket.on("message_seen", (payload) => {
    console.log("Message Seen", payload);
  });

  socket.on("typing", (payload) => {
    console.log("Typing", payload);
  });

  socket.on("stopped_typing", (payload) => {
    console.log("Stopped Typing", payload);
  });

  //handle disconnect event
  socket.on("disconnect", () => {
    console.log("Disconnected");

    //show join form
    document.getElementById("join-form").style.display = "block";
  });
};

const form = document.getElementById("join-form");
form.addEventListener("submit", handleJoin);
