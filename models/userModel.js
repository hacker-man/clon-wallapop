var mongoose = require('mongoose');

// Schema:

var userSchema = mongoose.Schema({
    name: String,
    rol: String,
    email: String,
    pass: String,
    photoSocial: String,
    date: Date,
    birthDate: Date,
    gender: String,
    phone: Number,
    favCat: [String],
    google: String,
    facebook: String,
    myRating: Number,
    sale: [String],
    sold: [String],
    reviews: [String],
    favAds: [String],
    latitude: Number,
    longitude: Number,
    chats: [String]

});

/* Para listar los usuarios, si no se introduce "sort", se ordenan por name. Si no se quiere hacer filtros, hay que poner {} al llamar a la función */
userSchema.statics.list = function(filter, sort, cb) {
    var sortBy = sort || "name";
    // preparamos la query sin ejecutarla
    var query = User.find(filter);
    // añadimos más parámetros a la query
    query.sort(sortBy);

    // se ejecuta la query:
    query.exec(function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, rows);
        return;
    });
};

// Al modelo le metemos el esquema
var User = mongoose.model('User', userSchema);
