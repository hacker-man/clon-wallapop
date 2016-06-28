var mongoose = require('mongoose');

// Schema:
var chatSchema = mongoose.Schema({
    userId1: String,
    userId2: String,
    messages: [{
        user: String,
        timestamp: Date,
        msg: String
    }]
});

// Al modelo le metemos el esquema
var Chat = mongoose.model('Chat', chatSchema);
