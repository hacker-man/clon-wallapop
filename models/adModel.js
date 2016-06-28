var mongoose = require('mongoose');
var geolib = require('geolib');

var adSchema = mongoose.Schema({
    title: String,
    image: String,
    detail: String,
    creationDate: Date,
    owner: String,
    ownerId: String,
    price: Number,
    badge: String,
    category: String,
    tags: [String],
    exchanges: Boolean,
    negotiable: Boolean,
    shipments: Boolean,
    sold: Boolean,
    visits: Number,
    likes: Number,
    purchaser: String,
    ownerId: String,
    purchaserId: String,
    latitude: Number,
    longitude: Number

});

adSchema.statics.list = function(filter, price, sort, location, cb) {
    var distance = 300000000000;

    if (price !== undefined) {
        var splitPrice = price.split('-');
        if (splitPrice.length === 1) {
            filter.price = price;
        } else {
            if (splitPrice[0] !== "" && splitPrice[1] === "") { //del tipo X-
                filter.price = { "$gte": splitPrice[0] };
            } else { //del tipo X-Y
                filter.price = { "$gte": splitPrice[0], "$lte": splitPrice[1] };
            }
        }
    }

    var query = Ad.find(filter);
    if (sort !== undefined && sort !== "location") {
        query.sort(sort);
    }
    query.exec(function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        //ORDENACION POR PROXIMIDAD
        if (location !== undefined) {
            //Si hay filtro de distancia, lo obtenemos
            if (location.distance !== undefined) {
                distance = location.distance;
            }
            //Si es localización, recibiremos en location un objeto con latitud y longitud del usuario que hizo la peticion
            //Ahora tenemos tanto la ubicación de la persona que busca como de todos los anuncios filtrados
            //Calculamos distancias entre latlng's
            var location1;
            if (location.latitude !== undefined && location.longitude !== undefined) {
                location1 = { latitude: location.latitude, longitude: location.longitude };
            } else if (location.livingArea !== undefined) {
                location1 = { latitude: location.livingArea, longitude: location.livingArea };
            } else {
                //Una por defecto
                location1 = { latitude: 0, longitude: 0 };
            }
            var sortedRows = [];
            rows.forEach(function(element, index) {
                // statements
                var location2 = { latitude: element.latitude, longitude: element.longitude };
                if (geolib.getDistance(location1, location2) < distance * 1000) {
                    //Añadimos todos los elementos que cumplan la restriccion
                    element['distance'] = geolib.getDistance(location1, location2);
                    sortedRows.push(element);
                }
            });

            if (sort === "location") {
                //Ordenamos este array por distancia
                sortedRows.sort(function(a, b) {
                    return parseFloat(a.distance) - parseFloat(b.distance);
                });
            }
            rows = sortedRows;
        }

        cb(null, rows);
        return;
    });
}

var Ad = mongoose.model('Ad', adSchema);
