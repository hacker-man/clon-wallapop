var mongoose = require('mongoose');

// Schema:

var countSchema = mongoose.Schema ({
    counter:{
        type: Number,
        default: 0
    } 
});

var Count = mongoose.model('Count', countSchema);