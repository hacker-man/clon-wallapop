var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = mongoose.model("User");
var Ad = mongoose.model("Ad");
var Count = mongoose.model("Count");

var middleware = require("../../lib/middleware");
var service = require("../../lib/service");
var crypto = require("crypto");
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var fs = require("fs");
var async = require("async");
var jwt = require("jwt-simple");
var config = require("../../lib/config");
var adDetailTimestamps = []; /*Matrix que guarda las ips y los timestamps*/

router.post("/createAd", upload.single("description"), function(req, res) {

    req.body = req.body.ad;
    if (req.body.title === undefined || req.body.detail === undefined ||
        req.body.owner === undefined || req.body.ownerId === undefined || req.body.price === undefined ||
        req.body.badge === undefined || req.body.category === undefined ||
        req.body.exchanges === undefined || req.body.negotiable === undefined ||
        req.body.shipments === undefined || req.file === undefined) {
        return res.status(400).json({
            result: "All fields are mandatory",
            status: "Bad Request",
            code: 400
        });

    } else {
        var tipo = req.file.mimetype;
        var ext;
        if (tipo === "image/png" || tipo === "image/jpeg" || tipo === "image/jpg") {

            var imageRoute = "../images/ads-images/" + req.file.originalname;
            var adBody = req.body;
            //Anadimos tambien la ubicacion del anuncio
            if (adBody.latitude === undefined && adBody.longitude === undefined) {
                //Si el usuario no tiene, asignamos una por defecto
                adBody.latitude = 0;
                adBody.longitude = 0;
            }
            adBody.image = imageRoute;
            adBody.sold = false;
            adBody.visits = 0;
            adBody.likes = 0;
            adBody.purchaser = "";
            adBody.creationDate = new Date();
            switch (tipo) {
                case "image/png":
                    ext = ".png";
                    break;
                case "image/jpeg":
                    ext = ".jpeg";
                    break;
                case "image/jpg":
                    ext = ".jpg";
                    break;
                default:
                    break;
            }

            var searchCounter = Count.find({});
            searchCounter.exec(function(err, row) {
                if (err) {
                    return;
                }
                var sigcount = parseInt(row[0].counter) + 1;
                var objCount = { counter: sigcount };
                var imageRoute = "../images/ads-images/" + row[0].counter + ext;
                var adBody = req.body;
                adBody.image = imageRoute;
                adBody.sold = false;
                adBody.visits = 0;
                adBody.likes = 0;
                adBody.purchaser = "";
                adBody.creationDate = new Date();
                var ad = new Ad(adBody);
                fs.createReadStream("./uploads/" + req.file.filename)
                    .pipe(fs.createWriteStream("./public/images/ads-images/" + row[0].counter + ext));
                //borramos el archivo temporal creado
                fs.unlink("./uploads/" + req.file.filename, function(err) {
                    if (err) {
                        throw err;
                    }
                });

                Count.update({ _id: row[0]._id }, { $set: objCount }, function(err) {
                    if (err) {
                        res.status(500).json({
                            result: err.message,
                            status: "Internal server error",
                            code: 500
                        });
                        return;
                    }

                    ad.save(function(err, newAd) {
                        if (err) {
                            return res.status(500).json({
                                result: err.message,
                                status: "Internal Server Error",
                                code: 500
                            });
                        }
                        User.findOne({ _id: req.body.ownerId }, function(err, row) {
                            console.log(err);
                            if (err) {
                                res.status(500).json({
                                    result: err.message,
                                    status: "Internal server error",
                                    code: 500
                                });
                                return;
                            }
                            var sale = [];
                            sale = row.sale;
                            sale.push(newAd._id);
                            var objSale = { sale: sale };
                            User.update({ _id: req.body.ownerId }, { $set: objSale }, function(err, data) {
                                if (err) {
                                    return res.status(500).json({
                                        result: err.message,
                                        status: "Internal server error",
                                        code: 500
                                    });
                                }
                                return res.status(200).json({ ad: newAd, status: "OK", data: data });
                            });

                        });
                    });
                });
            });

        } else {
            return res.status(415).json({
                status: "Unsupported media type",
                code: 415
            });
        }
    }
});

router.get("/getAds", function(req, res) {
    //Sort puede valer 'location', 'price', '-price', 'creationDate'
    var sort = req.query.sort || "title";
    var price = req.query.price;
    var filter = {};

    if (typeof req.query.tag !== "undefined") {
        filter.tags = { $in: req.query.tag };
    }

    if (typeof req.query.category !== "undefined") {
        filter.category = { $in: req.query.category };
    }

    if (typeof req.query.title !== "undefined") {
        filter.$or = [{ title: { $regex: new RegExp(req.query.title, "i") } }, { detail: { $regex: new RegExp(req.query.title, "i") } }];
    }

    var userId;

    //Obtenemos el ID del usuario con el token
    if (req.headers.authorization !== undefined) {
        var token = req.headers.authorization.split(" ")[1];
        var payload = jwt.decode(token, config.TOKEN_SECRET);
        userId = payload.sub;
    }

    var location;
    //Comprobamos si queremos ordenar por ubicacion
    if (sort === "location" || (typeof req.query.location !== "undefined")) {
        //Buscamos la latitud y longitud del usuario que hizo la peticion
        User.findOne({ _id: userId }, function(err, result) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }
            //Datos de ubicacion del usuario
            if (result !== null) {
                location = {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    distance: req.query.location
                };
            } else {
                //Si no ha encontrado resultados es porque el usuario no está logeado
                location = {
                    latitude: 0,
                    longitude: 0,
                    distance: req.query.location
                };
            }

            Ad.list(filter, price, sort, location, function(err, rows) {
                if (err) {
                    return res.status(400).json({
                        result: err,
                        status: "Bad request, Internal error",
                        code: 400
                    });
                }
                res.status(200).send(rows);
            });
        });
    } else {
        Ad.list(filter, price, sort, location, function(err, rows) {
            if (err) {
                return res.status(400).json({
                    result: err,
                    status: "Bad request, Internal error",
                    code: 400
                });
            }
            res.status(200).send(rows);
        });
    }
});

router.get("/getAds/:id", function(req, res) {

    Ad.find({ _id: req.params.id }, function(err, row) {
        if (err) {
            return res.status(500).json({
                result: "That ad does not exists",
                status: "Bad request, Internal error",
                code: 500
            });
        }
        /*Aquí comprobaremos que esta IP no ha hecho más visitas a este anuncio en la última hora*/
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        /*En vez de guardar la ip, guardaremos el id del usuario por simplicidad en la red de Babel*/


        var flagTimestamp = 0;
        var actualTime = new Date();

        for (var i = 0; i < adDetailTimestamps.length; i++) {
            if (adDetailTimestamps[i][0] === ip) {
                flagTimestamp = 1;
                if (Number(actualTime) > (Number(adDetailTimestamps[i][1]) + 15000)) {
                    /*Lo quitamos del array si han pasado 15 segundos*/
                    adDetailTimestamps[i] = '';
                    flagTimestamp = 0;
                }
            }
        }

        var objCount = {};
        if (flagTimestamp === 0) {
            var newDataTimestamp = [ip, new Date()];
            adDetailTimestamps[adDetailTimestamps.length] = newDataTimestamp;
            var visits = parseInt(row[0].visits) + 1;
            objCount = { visits: visits };
        }

        /*Aprovechamos en este metodo y aumentamos las visitas*/
        Ad.update({ _id: row[0]._id }, { $set: objCount }, function(err) {
            if (err) {
                res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
                return;
            }
            res.status(200).send(row[0]);
        });
    });
});

router.put("/editAd", upload.single("description"), function(req, res) {

    var purchaserId = req.body.purchaserId;
    req.body = req.body.ad;

    if (req.body.title === undefined || req.body.detail === undefined ||
        req.body.owner === undefined || req.body.ownerId === undefined || req.body.price === undefined ||
        req.body.badge === undefined || req.body.category === undefined ||
        req.body.exchanges === undefined || req.body.negotiable === undefined ||
        req.body.shipments === undefined || req.body.sold === undefined) {
        return res.status(400).json({
            status: "Bad Request, all form fields are mandatory"
        });

    } else {

        /*Creamos cuerpo del anuncio*/
        var adBody = req.body;

        var ad = new Ad(adBody);
        ad._id = req.body.adId;

        /*Comprobamos si viene un fichero nuevo*/
        if (req.file !== undefined) {

            var tipo = req.file.mimetype;
            var ext;
            if (tipo === "image/png" || tipo === "image/jpeg" || tipo === "image/jpg") {

                var imageRoute = "../images/ads-images/" + req.file.originalname;

                adBody.image = imageRoute;
                switch (tipo) {
                    case "image/png":
                        ext = ".png";
                        break;
                    case "image/jpeg":
                        ext = ".jpeg";
                        break;
                    case "image/jpg":
                        ext = ".jpg";
                        break;
                }
                var searchCounter = Count.find({});
                searchCounter.exec(function(err, row) {
                    if (err) {
                        return;
                    }
                    var sigcount = parseInt(row[0].counter) + 1;
                    var objCount = { counter: sigcount };
                    var imageRoute = "../images/ads-images/" + row[0].counter + ext;

                    adBody.image = imageRoute;

                    fs.createReadStream("./uploads/" + req.file.filename)
                        .pipe(fs.createWriteStream("./public/images/ads-images/" + row[0].counter + ext));
                    //borramos el archivo temporal creado
                    fs.unlink("./uploads/" + req.file.filename, function(err) {
                        if (err) {
                            throw err;
                        }

                    });

                    /*Actualizamos contador*/
                    Count.update({ _id: row[0]._id }, { $set: objCount }, function(err) {
                        if (err) {
                            res.status(500).json({
                                result: err.message,
                                status: "Internal server error",
                                code: 500
                            });
                            return;
                        }
                        ad.image = adBody.image;
                        purchaseAndUpdateAd(req, res, ad, purchaserId);
                        return;
                    });
                });

            } else {
                return res.status(415).json({
                    status: "Unsupported media type",
                    code: 415
                });
            }
        } else {
            purchaseAndUpdateAd(req, res, ad, purchaserId);
            return;
        }
    }
});

function purchaseAndUpdateAd(req, res, ad, purchaserId) {
    /*Actualizamos anuncio*/
    // Buscamos a los usuarios cuyo nombre coincida con el comprador
    if (ad.sold === true) {
        User.find({ name: ad.purchaser }, function(err, row) {
            if (err) {
                res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
                return;
            }
            // Si solo hay un comprador
            if (row.length === 1) {
                // y es el mismo que el dueño del usuario
                /* ES == Y NO === PORQUE APARENTEMENTE EN UNO ES STRING Y EN OTRO DE TIPO NUMBER*/
                if (row[0]._id == ad.ownerId) {
                    res.status(409).json({
                        result: "You cannot sell an ad to yourself",
                        status: "Forbidden",
                        translation: "EDITAD.ERRORMESSAGE1",
                        code: 409
                    });
                    return;
                } else {
                    // Si solo hay un usuario con ese nombre, se continua
                    // El comprador será el usuario encontrado
                    ad.purchaserId = row[0]._id;
                    updateAd(req, res, ad);
                }
            }
            // Si no hay ningun comprador con ese nombre
            if (row.length === 0) {
                res.status(409).json({
                    result: "There are no users with such name",
                    status: "Conflict",
                    translation: "EDITAD.ERRORMESSAGE2",
                    code: 409
                });
                return;
            }
            // Si hay más de un comprador
            if (row.length > 1) {
                // Si se ha seleccionado un usuario
                if (purchaserId !== undefined) {
                    // Si el comprador es el mismo que el usuario propietario del anuncio
                    if (purchaserId === ad.ownerId) {
                        res.status(409).json({
                            result: "You cannot sell an ad to yourself",
                            status: "Forbidden",
                            translation: "EDITAD.ERRORMESSAGE1",
                            users: row,
                            code: 409
                        });
                        return;
                    } else {
                        // El comprador es el usuario pasado por parámetro
                        ad.purchaserId = purchaserId;
                        updateAd(req, res, ad);
                    }
                } else {
                    res.status(409).json({
                        result: "There are several users with the same name",
                        status: "Conflict",
                        translation: "EDITAD.ERRORMESSAGE3",
                        users: row,
                        code: 409
                    });
                    return;
                }
            }
        });
    } else {
        // si se ha vuelto a poner en venta
        // No hay comprador
        ad.purchaser = "";
        ad.purchaserId = "";
        updateAd(req, res, ad);
    }
}

function updateAd(req, res, ad) {
    // Aqui el id del usuario vendedor no lo usamos para nada. Solo queda marcado como vendido por un usuario particular
    Ad.update({ _id: ad.id }, { $set: ad }, function(err, newAd) {
        if (err) {
            return res.status(500).json({
                result: err.message,
                status: "Internal Server Error",
                code: 500
            });
        }
        /*Actualizamos usuario*/
        User.findOne({ _id: ad.ownerId }, function(err, row) {
            if (err) {
                res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
                return;
            }

            var sale = row.sale;
            var sold = row.sold;
            var index;
            if (ad.sold === true) {
                // Si se ha vendido
                // HABRA QUE MANDARLE NOTIFICACION AL USUARIO COMPRADOR
                index = sale.indexOf(ad.id);
                if (index > -1) {
                    sale.splice(index, 1);
                    sold.push(ad.id);
                }
            } else {
                // Si no ha sido vendido
                index = sold.indexOf(ad.id);
                if (index > -1) {
                    sold.splice(index, 1);
                    sale.push(ad.id);
                }
            }

            var objSale = { sale: sale, sold: sold };
            User.update({ _id: ad.ownerId }, { $set: objSale }, function(err, data) {
                if (err) {
                    return res.status(500).json({
                        result: err.message,
                        status: "Internal server error",
                        code: 500
                    });
                }
                res.status(200).json({ ad: newAd, status: "OK", data: data });
                return;
            });
        });
    });
}

router.put("/deleteAd", function(req, res) {

    var idUser = req.body.userId;
    var idAd = req.body.ad;
    /*Quitamos de todos los usuarios que tenían este anuncio en favoritos*/
    User.find({ favAds: { $elemMatch: { $eq: idAd } } }, function(err, users) {
        /*Quitamos de todos los usuarios el favorito*/
        async.each(users, function cada(user, siguiente) {
                // Call an asynchronous function, often a save() to DB
                var indexFav = user.favAds.indexOf(idAd);
                if (indexFav > -1) {
                    user.favAds.splice(indexFav, 1);
                    User.update({ _id: user._id }, { $set: { favAds: user.favAds } }, function(err) {
                        if (err) {
                            return res.status(500).json({
                                result: err.message,
                                status: "Internal server error",
                                code: 500
                            });
                        }
                        siguiente();
                    });
                }
            },
            function() {
                // All tasks are done now
                /*Quitamos de nuestra base de datos el anuncio elegido*/
                Ad.findOneAndRemove({ _id: idAd }, function(err) {
                    if (err) {
                        res.status(500).json({
                            result: err.message,
                            status: "Internal server error",
                            code: 500
                        });
                        return;
                    }
                    /*Actualizamos 'sale' de usuario*/
                    User.findOne({ _id: idUser }, function(err, row) {
                        if (err) {
                            res.status(500).json({
                                result: err.message,
                                status: "Internal server error",
                                code: 500
                            });
                            return;
                        }

                        var sale = [];
                        sale = row.sale;
                        var index = sale.indexOf(idAd);
                        sale.splice(index, 1);
                        var objSale = { sale: sale };
                        User.update({ _id: idUser }, { $set: objSale }, function(err) {
                            if (err) {
                                return res.status(500).json({
                                    result: err.message,
                                    status: "Internal server error",
                                    code: 500
                                });
                            }
                            User.find({ _id: idUser }, function(err, data) {
                                if (err) {
                                    return res.status(500).json({
                                        result: err.message,
                                        status: "Internal server error",
                                        code: 500
                                    });
                                }
                                return res.status(200).json({ status: "OK", data: data });
                            });
                        });
                    });
                });
            });
    });

});

module.exports = router;
