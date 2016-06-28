var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = mongoose.model("User");
var Ad = mongoose.model("Ad");
var Count = mongoose.model("Count");
var Chat = mongoose.model("Chat");

var middleware = require("../../lib/middleware");
var service = require("../../lib/service");
var crypto = require("crypto");
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var fs = require("fs");
var async = require("async");
var config = require("../../lib/config");

router.post("/createChat", function(req, res) {
    // req.body vienen el usuario 1 y 2
    var chat = new Chat(req.body);
    var newChat;
    var newChats;
    chat.save(function(err, createdChat) {
        if (err) {
            return res.status(500).json({
                result: err.message,
                status: "Internal Server Error",
                code: 500
            });
        }
        newChat = createdChat;
        User.find({ _id: req.body.userId1 }, function(err, row) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }
            row[0].chats.push(newChat._id);
            newChats = row[0].chats;
            User.update({ _id: req.body.userId1 }, { $set: { chats: newChats } }, function(err, row) {
                if (err) {
                    return res.status(500).json({
                        result: err.message,
                        status: "Internal server error",
                        code: 500
                    });
                }
                User.find({ _id: req.body.userId2 }, function(err, row) {
                    if (err) {
                        return res.status(500).json({
                            result: err.message,
                            status: "Internal server error",
                            code: 500
                        });
                    }
            
                    row[0].chats.push(newChat._id);
                    newChats = row[0].chats;
                    User.update({ _id: req.body.userId2 }, { $set: { chats: newChats } }, function(err, row) {
                        if (err) {
                            return res.status(500).json({
                                result: err.message,
                                status: "Internal server error",
                                code: 500
                            });
                        }
                        return res.status(200).send("OK");
                    });
                });
            });
        });
    });
});

router.post("/isNewChat", function(req, res) {
    Chat.find({ $and: [{ $or: [{ userId1: req.body.userId1, userId2: req.body.userId2 }, { userId1: req.body.userId2, userId2: req.body.userId1 }] }] }, function(err, row) {
        if (err) {
            return res.status(500).json({
                result: err.message,
                status: "Internal server error",
                code: 500
            });
        }
     
        if (row.length > 0) {
            return res.status(200).send(false);
        } else {
            return res.status(200).send(true);
        }
    });
});

router.get("/getChatMessages/:askerId/:targetId", function(req, res) {

    Chat.find({ $and: [{ $or: [{ userId1: req.params.askerId, userId2: req.params.targetId }, { userId1: req.params.targetId, userId2: req.params.askerId }] }] }, function(err, row) {

        if (err) {
            return res.status(500).json({
                result: err.message,
                status: "Internal server error",
                code: 500
            });
        }


        return res.status(200).send(row[0].messages);
    });

});

module.exports = router;
