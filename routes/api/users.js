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


/*******Configuración de traducción de direcciones a coordenadas********/

var NodeGeocoder = require("node-geocoder");

var options = {
    provider: "google",

    // Optionnal depending of the providers 
    httpAdapter: "https", // Default 
    apiKey: "AIzaSyAbZTzPvRjcVH3ixhKgvTzeb2Re12j_kM8", // for Mapquest, OpenCage, Google Premier 
    formatter: null // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);

/*****Configuración de recuperación de contraseña*******/

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(smtpTransport({   
    service: "Gmail",
       auth: {        user: "babelpopteam@gmail.com",        pass: config.EMAIL_PASSWORD    }
}));

router.post("/login", function(req, res) {
    var sha256 = crypto.createHash("sha256");
    sha256.update(req.body.pass, "utf8");
    var passConHash = sha256.digest("base64");
    User.findOne({
        email: req.body.email.toLowerCase(),
        pass: passConHash
    }, function(err, row) {
        if (err) {
            return;
        }
        if (row === null) {
            res.status(401).json({
                result: "pass or email invalid",
                status: "Unauthorized",
                code: 401
            });
        } else {
            return res
                .status(200)
                .send({
                    token: service.createToken(row),
                    name: row.name,
                    photo: row.photoSocial,
                    id: row._id,
                    favAds: row.favAds
                });
        }
    });
});

router.get("/users/", function(req, res) {
    var sort = req.query.sort || "name";
    User.list({}, sort, function(err, rows) {
        if (err) {
            return res.status(500).json({
                result: "Internal error while looking for the user",
                status: "Internal Server Error",
                code: 500
            });
        }
        return res.status(200).send(rows);
    });
});

router.get("/users/:id", function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, rows) {
        if (err) {
            return res.status(500).json({
                result: "That user does not exists",
                status: "Internal Server Error",
                code: 500
            });
        }
        return res.status(200).send(rows[0]);
    });
});

router.get("/sale/:id", function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, rows) {
        if (err) {
            return res.status(500).json({
                result: "That user does not exists",
                status: "Internal Server Error",
                code: 500
            });
        }
        var sale = [];
        var user = rows[0];
        async.each(user.sale, function cada(id, siguiente) {
            var query = Ad.find({ _id: id });
            query.exec(function(err, rows) {
                if (err) {
                    return;
                }
                sale.push(rows[0]);
                siguiente();
            });
        }, function(err) {
            if (err) {
                return res.status(500).json({
                    result: "Se ha producido un error recuperar los anuncios",
                    status: "Internal Server Error",
                    code: 500
                });
            } else {
                sale = sortByKey(sale, "title");
                return res.send(sale);
            }
        });

    });
});

router.get("/sold/:id", function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, rows) {
        var sold = [];
        var user = rows[0];
        async.each(user.sold, function cada(id, siguiente) {
            var query = Ad.find({ _id: id });
            query.exec(function(err, rows) {
                if (err) {
                    return;
                }
                sold.push(rows[0]);
                siguiente();
            });
        }, function(err) {
            if (err) {
                return res.status(500).json({
                    result: "Se ha producido un error recuperar los anuncios",
                    status: "Internal Server Error",
                    code: 500
                });
            } else {
                sold = sortByKey(sold, "title");
                res.send(sold);
            }
        });
    });
});

router.get("/favAds/:id", function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, rows) {
        var favAds = [];
        var user = rows[0];
        async.each(user.favAds, function cada(id, siguiente) {
            var query = Ad.find({ _id: id });
            query.exec(function(err, rows) {
                if (err) {
                    return;
                }
                favAds.push(rows[0]);
                siguiente();
            });
        }, function(err) {
            if (err) {
                return res.status(500).json({
                    result: "Se ha producido un error recuperar los anuncios",
                    status: "Internal Server Error",
                    code: 500
                });
            } else {
                favAds = sortByKey(favAds, "title");
                res.send(favAds);
            }
        });
    });
});


router.get("/location/:id", middleware.ensureAuthenticated, function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, row) {
        if (err) {
            return res.status(500).json({
                result: "That user does not exists",
                status: "Internal Server Error",
                code: 500
            });
        }
        return res.status(200).json({
            latitude: row[0].latitude,
            longitude: row[0].longitude
        });
    });
});

router.post("/signUp/", function(req, res) {
    var filters = {};
    if (req.body.name === undefined || req.body.pass === undefined || req.body.email === undefined) {
        return res.status(400).json({
            result: "All fields are mandatory",
            status: "Bad Request",
            code: 400
        });
    } else {
        filters.email = req.body.email;
        User.list(filters, "email", function(err, rows) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal Server Error",
                    code: 500
                });
            }
            if (rows.length !== 0) {
                return res.status(403).json({
                    result: "user already exists",
                    status: "Forbidden, user already exists",
                    code: 403
                });
            } else {
                var user = req.body;
                var sha256 = crypto.createHash("sha256");
                sha256.update(req.body.pass, "utf8");
                var passConHash = sha256.digest("base64");
                user.pass = passConHash;
                user.date = new Date();
                user.photoSocial = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg";
                var us = new User(user);
                us.save(function(err, newUser) {
                    if (err) {
                        return res.status(500).json({
                            result: err.message,
                            status: "Internal Server Error",
                            code: 500
                        });
                    }
                    return res.status(200).json({
                        token: service.createToken(newUser),
                        name: newUser.name,
                        id: newUser._id
                    });
                });
            }
        });
    }
});

router.put("/infoUser/:id", middleware.ensureAuthenticated, function(req, res) {
    if (req.body._id !== undefined || req.body.date !== undefined ||
        req.body.rol !== undefined || req.body.pass !== undefined ||
        req.body.email !== undefined) {
        res.status(406).json({
            result: "You only can modify name, gender, birthDate or phone",
            status: "Not Acceptable",
            code: 406
        });
    }
    User.update({ _id: req.params.id }, { $set: req.body }, function(err, data) {
        if (err) {
            res.status(500).json({
                result: err.message,
                status: "Internal server error",
                code: 500
            });
            return;
        }
        return res.status(200).json({
            modified: data.nModified,
            status: "OK"
        });
    });
});

router.put("/categories/:id", middleware.ensureAuthenticated, function(req, res) {
    if (req.body.favCat !== undefined) {
        User.update({ _id: req.params.id }, { $set: req.body }, function(err, data) {
            if (err) {
                res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
                return;
            }
            return res.status(200).json({
                modified: data.nModified,
                status: "OK"
            });
        });
    } else {
        return res.status(406).json({
            result: "You must send favCat in body",
            status: "Not Acceptable",
            code: 406
        });
    }
});

router.put("/email/:id", middleware.ensureAuthenticated, function(req, res) {
    if (req.body._id !== undefined || req.body.date !== undefined ||
        req.body.rol !== undefined || req.body.pass !== undefined) {
        return res.status(406).json({
            result: "You can't modify user _id, date of creation or rol or password",
            status: "Not Acceptable",
            code: 406
        });
    }
    if (req.body.email !== undefined) {
        var email = req.body.email.toLowerCase || "";
        User.findOne({ email: email }, function(err, result) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }
            if (result !== null) {
                return res.status(406).json({
                    result: "User with this email already exists",
                    status: "Not Acceptable",
                    code: 406
                });
            }
            User.update({
                _id: req.params.id
            }, {
                $set: req.body
            }, function(err, data) {
                if (err) {
                    res.status(500).json({
                        result: err.message,
                        status: "Internal server error",
                        code: 500
                    });
                    return;
                }
                return res.status(200).json({
                    modified: data.nModified,
                    status: "OK"
                });
            });
        });
    } else {
        return res.status(406).json({
            result: "You must send email in te request",
            status: "Not Acceptable",
            code: 406
        });
    }
});


router.put("/photo/:id", middleware.ensureAuthenticated, upload.single("avatar"), function(req, res) {
    if (req.body._id !== undefined || req.body.date !== undefined ||
        req.body.rol !== undefined || req.body.pass !== undefined) {
        return res.status(406).json({
            result: "You can't modify user _id, date of creation or rol or password",
            status: "Not Acceptable",
            code: 406
        });
    }
    if (req.file !== undefined) {
        var tipo = req.file.mimetype;
        var imageRoute, ext;
        if (tipo === "image/png" || tipo === "image/jpeg" || tipo === "image/jpg") {
            switch (tipo) {
                case "image/png":
                    imageRoute = "../images/profile-images/" + req.params.id + ".png";
                    ext = ".png";
                    break;
                case "image/jpeg":
                    imageRoute = "../images/profile-images/" + req.params.id + ".jpeg";
                    ext = ".jpeg";
                    break;
                case "image/jpg":
                    imageRoute = "../images/profile-images/" + req.params.id + ".jpg";
                    ext = ".jpg";
                    break;
                default:
                    break;
            }
        }
        fs.createReadStream("./uploads/" + req.file.filename)
            .pipe(fs.createWriteStream("./public/images/profile-images/" + req.params.id + ext));
        //borramos el archivo temporal creado
        fs.unlink("./uploads/" + req.file.filename, function(err) {
            if (err) {
                throw err;
            }

        });
        var changeImage = { photoSocial: imageRoute };
        User.update({
            _id: req.params.id
        }, {
            $set: changeImage
        }, function(err, data) {
            if (err) {
                res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
                return;
            }
            return res.status(200).json({
                modified: data.nModified,
                imageRoute: imageRoute,
                status: "OK"
            });
        });
    } else {
        res.status(406).json({
            result: "You must send file in the request",
            status: "Not Acceptable",
            code: 406
        });
    }
});

router.put("/pass/:id", middleware.ensureAuthenticated, function(req, res) {
    if (req.body._id !== undefined || req.body.date !== undefined ||
        req.body.rol !== undefined) {
        return res.status(406).json({
            result: "You can't modify user _id, date of creation or rol",
            status: "Not Acceptable",
            code: 406
        });
    }
    if (req.body.prevPass !== undefined && req.body.pass !== undefined) {
        //comprobar si la prevPass coincide con la pass de la base de datos
        var sha256 = crypto.createHash("sha256");
        sha256.update(req.body.prevPass, "utf8");
        req.body.prevPass = sha256.digest("base64");

        User.findOne({ _id: req.params.id }, function(err, result) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }
            if (result.pass === req.body.prevPass) { //la contraseña de la bbdd coincide con la recibida
                //cambiar la contraseña por la nueva (req.body.pass)
                var sha256 = crypto.createHash("sha256");
                sha256.update(req.body.pass, "utf8");
                req.body.pass = sha256.digest("base64");

                var changePass = { pass: req.body.pass };
                User.update({ _id: req.params.id }, { $set: changePass }, function(err, data) {
                    if (err) {
                        res.status(500).json({
                            result: err.message,
                            status: "Internal server error",
                            code: 500
                        });
                        return;
                    }
                    return res.status(200).json({
                        modified: data.nModified,
                        status: "OK"
                    });
                });
            } else { //la contraseña de la bbd no coincide con la recibida
                return res.status(409).json({
                    result: "The previous password doesn't matches the bbdd password",
                    status: "Conflict",
                    code: 409
                });
            }
        });
    } else {
        res.status(406).json({
            result: "You must send pass and prevPass",
            status: "Not Acceptable",
            code: 406
        });
    }
});

router.put("/location/:id", middleware.ensureAuthenticated, function(req, res) {
    //Traducimos livingArea (si hay) a coordenadas
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    if (req.body.livingArea !== undefined || (latitude !== undefined && longitude !== undefined)) {
        geocoder.geocode(req.body.livingArea, function(err, translate) {
            if (!err) {
                latitude = translate[0].latitude;
                longitude = translate[0].longitude;
            }
            var latLong = { latitude: latitude, longitude: longitude };
            User.update({ _id: req.params.id }, { $set: latLong }, function(err) {
                if (err) {
                    return res.status(500).json({
                        result: err.message,
                        status: "Internal server error",
                        code: 500
                    });
                }
                Ad.update({ ownerId: req.params.id }, { $set: latLong }, { multi: true }, function(err, data) {
                    if (err) {
                        return res.status(500).json({
                            result: err.message,
                            status: "Internal server error",
                            code: 500
                        });
                    }
                    return res.status(200).json({
                        modified: data.nModified,
                        status: "OK"
                    });
                });
            });
        });
    } else {
        return res.status(406).json({
            result: "You must send latitude and longitude or livingArea",
            status: "Not Acceptable",
            code: 406
        });
    }
});

router.put("/editFavs", function(req, res) {

    /*Añadimos favoritos al usuario, campo 'id'*/
    User.findOne({ _id: req.body.id }, function(err, row) {
        if (err) {
            res.status(500).json({
                result: err.message,
                status: "Internal server error",
                code: 500
            });
            return;
        }

        var flag;
        var favAds = row.favAds;
        /*Comprobamos si el usuario lo tiene o no*/
        if (favAds.indexOf(req.body.adId) === -1) {
            favAds.push(req.body.adId);
            flag = 1;
        } else {
            var index = favAds.indexOf(req.body.adId);
            favAds.splice(index, 1);
            flag = 0;
        }

        var objSale = { favAds: favAds };
        User.update({ _id: req.body.id }, { $set: objSale }, function(err) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }

            /*Aumentamos en uno los likes del anuncio, campo 'id_ad'*/
            Ad.findOne({ _id: req.body.adId }, function(err, row) {
                if (err) {
                    res.status(500).json({
                        result: err.message,
                        status: "Internal server error",
                        code: 500
                    });
                    return;
                }
                if (flag === 1) {
                   var likes = row.likes + 1;
                } else {
                    likes = row.likes - 1;
                }

                var objSale = { likes: likes };
                Ad.update({ _id: req.body.adId }, { $set: objSale }, function(err, data) {
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


router.post("/forgotten", function(req, res) {
    /*En este metodo llega el correo electrónico en el body*/
    /*Comprobamos si el correo existe*/

    User.findOne({ email: req.body.email }, function(err) {
        if (err) {
            res.status(500).json({
                result: err.message,
                status: "Internal server error",
                code: 500
            });
            return;
        }
        /*Si existe generamos una nueva contraseña*/
        var randomPassword = Math.random().toString(36).slice(-8);
        var sha256 = crypto.createHash("sha256");
        sha256.update(randomPassword, "utf8");
        var passConHash = sha256.digest("base64");

        var objPass = { pass: passConHash };
        User.update({ email: req.body.email }, { $set: objPass }, function(err, data) {
            if (err) {
                return res.status(500).json({
                    result: err.message,
                    status: "Internal server error",
                    code: 500
                });
            }
            var htmlMsg;
            if (req.body.lang === "en_US") {
                htmlMsg = config.HTML_MSG1_EN + randomPassword + config.HTML_MSG2_EN;
            } else {
                htmlMsg = config.HTML_MSG1_ES + randomPassword + config.HTML_MSG2_ES;
            }
            transporter.sendMail({
                from: "babelpopteam@gmail.com",
                to: req.body.email,
                subject: "Babelpop: Tu nueva contraseña",
                html: htmlMsg,
                text: "hello world!"
            });

            transporter.close();
            return res.status(200).json({ status: "OK", data: data });
        });

    });
});

router.get("/getChats/:id", function(req, res) {
    User.list({ _id: req.params.id }, "name", function(err, rows) {
        if (err) {
            return res.status(500).json({
                result: "That user does not exists",
                status: "Internal Server Error",
                code: 500
            });
        }
        var chat = [];
        async.each(rows[0].chats, function cada(idChat, siguiente) {
            Chat.find({ _id: idChat }, function(err, rows) {
                if (err) {
                    return res.status(500).json({
                        result: "Se ha producido un error recuperar los anuncios",
                        status: "Internal Server Error",
                        code: 500
                    });
                }
                chat.push(rows[0]);
                siguiente();
            });
        }, function(err) {
            if (err) {
                return res.status(500).json({
                    result: "Se ha producido un error recuperar los anuncios",
                    status: "Internal Server Error",
                    code: 500
                });
            }
            return res.send(chat);
        });
    });
});

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports = router;
