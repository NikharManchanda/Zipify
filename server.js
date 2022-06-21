const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");
const fs = require("fs");

const app = express();

///
var siofu = require("socketio-file-upload");
const { setTimeout } = require("timers/promises");
app.use(siofu.router);
///

// Creating the server ourselves instead of express as we will require it for socket as well
const server = http.createServer(app);

const io = socketio(server);
// Set static folder entry point (takes arg realtive to server.js)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

const bot = "Zipify";

// Run when client connects
io.on("connection", (socket) => {
    // When client joins a room
    socket.on("joinRoom", ({ username, room }) => {
        userJoin(socket.id, username, room);
        socket.join(room);

        // This will emit to single client that we are connecting
        socket.emit(
            "message",
            formatMessage(bot, `Welcome to the room ${username}`)
        );

        // This will broadcast to everyone except the clinet
        // Runs when a client connects
        socket.broadcast
            .to(room)
            .emit("message", formatMessage(bot, `${username} has joined`));

        // Send users and room info to chat.html
        io.to(room).emit("roomUsers", {
            room,
            users: getRoomUsers(room),
        });
    });
    // When server receives a msg to be broadcasted by a client
    socket.on("chatMessage", (message) => {
        // Broadcast to everybody in the room using io.emit();
        const user = getCurrentUser(socket.id);
        if (!user) return;
        io.to(user.room).emit("message", formatMessage(user.username, message));
    });

    // When someone disconnects
    socket.on("disconnect", () => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(bot, `${user.username} has left the chat`)
            );

            userLeave(socket.id);
            // Send users and room info to chat.html
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });

    //////
    var uploader = new siofu();
    uploader.dir = "./uploads";
    uploader.listen(socket);
    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        event.file.clientDetail.name = event.file.name;
        console.log("File Saved");
    });

    // Error handler:
    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });

    socket.on("fileMessage", (message) => {
        // Broadcast to everybody in the room using io.emit();
        const user = getCurrentUser(socket.id);
        console.log(user);
        io.to(user.room).emit(
            "file",
            formatMessage(user.username, message),
            deleteFiles()
        );
    });
    /////
});
const PORT = process.env.PORT || 3000;

// The app.listen() function is used to bind and listen the connections on the specified host and port.
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

var rimraf = require("rimraf");
var uploadsDir = __dirname + "/uploads";
function deleteFiles() {
    fs.readdir(uploadsDir, function (err, files) {
        files.forEach(function (file, index) {
            fs.stat(path.join(uploadsDir, file), function (err, stat) {
                var endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + 1000;
                if (now >= endTime) {
                    return rimraf(path.join(uploadsDir, file), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("successfully deleted");
                    });
                }
            });
        });
    });
}
