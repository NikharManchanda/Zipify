const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const body = document.querySelector(".body");
// Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// We brought a script tag for using io using index.html
const socket = io();
var ok = 0;

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get users and room
socket.on("roomUsers", ({ room, users }) => {
    outputRoom(room);
    outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
    outputMessage(message);
    // Automatically scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit event listner for chat messages to be sent from client
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    if (!msg) return;
    // Emiting message to the server which inturn io.emits it to everyone else
    socket.emit("chatMessage", msg);
    // Clear the input
    e.target.elements.msg.value = "";
});
document.getElementById("msg").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("emoji").innerHTML = `<i class="fas fa-smile"></i>`;
    ok = 0;
});
// Output Message to DOM
var k = 0;
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    k = 0;
    console.log(message.message.search("<iframe>"));
    if (message.message.search("</iframe>") === -1)
        message.message = highlightUrl(message.message);
    div.innerHTML = `
    <p class="meta">${message.user}<span> ${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function highlightUrl(message) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, function (url) {
        k = 1;
        return '<a href="' + url + '">' + url + "</a>";
    });
}
function outputRoom(room) {
    roomName.textContent = room;
}
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map((user) => `<li> ${user} </li>`).join("")}
    `;
}

/////
var siofu = new SocketIOFileUpload(socket);

siofu.listenOnInput(document.getElementById("file"));

// Do something on upload progress:
siofu.addEventListener("progress", function (event) {
    var percent = (event.bytesLoaded / event.file.size) * 100;
    console.log("File is", percent.toFixed(2), "percent loaded");
});

// Do something when a file is uploaded:
siofu.addEventListener("complete", function (event) {
    console.log(event.detail.name);
    socket.emit("fileMessage", event.detail.name);
});
socket.on("file", (message) => {
    var div = document.createElement("div");
    div.classList.add("message");
    var img = document.createElement("object");
    img.setAttribute("style", "width:100%;height:auto");
    img.data = message.message;
    div.innerHTML = `
    <p class="meta">${message.user}<span> ${message.time}</span></p>
    `;
    div.appendChild(img);
    document.querySelector(".chat-messages").appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
//////

// Emoji Picker
document.getElementById("emoji").addEventListener("click", () => {
    if (!ok) {
        document.getElementById(
            "emoji"
        ).innerHTML = `<emoji-picker class="dark"></emoji-picker>`;
        ok = 1;
        document.getElementById("bottom").scrollIntoView();
    } else {
        ok = 0;
        document.getElementById(
            "emoji"
        ).innerHTML = `<i class="fas fa-smile"></i>`;
    }
});
document.querySelector("#emoji").addEventListener("click", (e) => {
    e.preventDefault();
    if (!ok) return;
    document
        .querySelector("emoji-picker")
        .addEventListener("emoji-click", (event) => {
            event.preventDefault();
            document.getElementById("msg").value += event.detail.unicode;
        });
});
