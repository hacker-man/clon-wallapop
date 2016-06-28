module.exports = function(io) {
    "use strict";

    var mongoose = require("mongoose");

    var Chat = mongoose.model("Chat");

    // users which are currently connected to the chat
    var users = {};

    io.sockets.on("connection", function(socket) {

        // when the client emits "adduser", this listens and executes
        socket.on("adduser", function(username) {
            // we store the username in the socket session for this client
            socket.username = username;
            // add the client's username to the global list
            users[username] = socket.id;

            // Send the list of connected users to this socket
            io.to(socket.id).emit("requestConnectedSockets", users);
            // echo globally (all clients) that a person has connected
            socket.broadcast.emit("connectedSocket", username);
        });

        socket.on("newChatRoom", function(target, asker) {
            // Send the found id to the asker
            io.to(users[target._id]).emit("newChatRoom", asker);
        });

        // when the user disconnects.. perform this
        socket.on("disconnect", function() {
            

            // Desconectar socket
            socket.broadcast.emit("disconnectedSocket", socket.username);

            // remove the username from global users list
            delete users[socket.username];
        });

        // when the user kills the socket.. perform this
        socket.on("kill", function() {
            

            // Desconectar socket
            socket.broadcast.emit("disconnectedSocket", socket.username);

            // remove the username from global users list
            delete users[socket.username];
        });

        // when the user sends a private msg to a user id, first find the username
        socket.on("check_user", function(askerId, id) {
            // Send the found id to the asker
            io.to(users[askerId]).emit("msg_user_found", id);
        });

        // when the user sends a private message to a user, perform this
        socket.on("msg_user", function(target, asker, username, msg) {

            if (msg !== "") {
                var fullMessage = {
                    user: asker,
                    timestamp: new Date(),
                    msg: msg
                };
                // Guardar mensaje en base de datos
                Chat.find({ $and: [{ $or: [{ userId1: asker, userId2: target }, 
                    { userId1: target, userId2: asker }] }] },
                    function(err, row) {
                        if (err) {
                            console.log("ERROR AL BUSCAR CHATS",err);
                        }
                        row[0].messages.push(fullMessage);

                        Chat.update({ _id: row[0]._id }, { $set: { messages: row[0].messages } }, function(err, row) {

                            if (err) {
                                console.log("ERROR AL GUARDAR MENSAJES");
                            }
                        });
                    });

                io.to(users[asker]).emit("msg_asker_handle", fullMessage);
                io.to(users[target]).emit("msg_target_handle", fullMessage);
            }
        });
    });
};
