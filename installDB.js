"use strict";
//Se requieren la conexión y los modelos de la base de datos:
require('./lib/connectDB');
require('./models/userModel');
require('./models/adModel');
var mongoose = require('mongoose');
var Usuario = mongoose.model('User');
var Ad = mongoose.model('Ad');
var async = require('async');
var fs = require('fs');
var crypto = require("crypto");

function eliminaUsuarios() {
    return new Promise(function(resolve, reject) {
        Usuario.remove({}, function(err) {
            if (err)
                reject(console.log('Error al eliminar usuarios', err));
        });
        resolve(console.log('Usuarios eliminados'));
    });
}

function eliminaAnuncios() {
    return new Promise(function(resolve, reject) {
        Ad.remove({}, function(err) {
            if (err) {
                reject(console.log("Error al eliminar anuncios", err));
            }
        });
        resolve(console.log("Anuncios eliminados"));
    });
}


function cargaUsuarios() {
    return new Promise(function(resolve, reject) {
        fs.readFile('users.json', {
            encoding: 'utf8'
        }, function(err, data) {
            if (err) {
                reject(err);
            }
            var datosDB = JSON.parse(data);
            var usuarios = datosDB["users"];
            async.each(usuarios, function cada(item, siguiente) {
                var infoPhoto = {};
                infoPhoto.data = item.photo;
                infoPhoto.contentType = "image/jpg";

                var sha256 = crypto.createHash("sha256");
                sha256.update(item.pass, "utf8");
                var passConHash = sha256.digest("base64");
                var usuario = new Usuario({
                    name: item.name,
                    userName: item.userName,
                    rol: item.rol,
                    pass: passConHash, //hash.sha256().update(item.password).digest('hex'),
                    email: item.email,
                    date: item.date,
                    photo: infoPhoto
                });
                usuario.save(function(err, usuarioCreado) {
                    if (err) {
                        siguiente(err);
                        return;
                    }
                    siguiente();
                });
            }, function(err) {
                if (err) {
                    reject("Se ha producido un error al cargar usuarios", err);
                } else {
                    resolve(console.log('Usuarios cargados'));
                }
            });
        });
    });
}

function cargaAnuncios() {
    return new Promise(function(resolve, reject) {
            fs.readFile('ads.json', {
                encoding: 'utf8'
            }, function(err, data) {
                if (err) {
                    reject(err);
                }
                var datosDB = JSON.parse(data);
                var anuncios = datosDB["ads"];
                async.each(anuncios, function cada(item, siguiente) {
                    var ad = new Ad({
                        title: item.title,
                        detail: item.detail,
                        creationDate: item.creationDate,
                        owner: item.owner,
                        // ownerId: item.ownerId,
                        price: item.price,
                        badge: item.badge,
                        category: item.category,
                        tags: item.tags,
                        exchanges: item.exchanges,
                        negotiable: item.negotiable,
                        shipments: item.shipments,
                        sold: item.sold,
                        visits: item.visits,
                        likes: item.likes,
                        purchaser: item.purchaser,
                        // purchaserId: item.purchaserId,
                        image: item.image
                    });
                    ad.save(function(err, anuncioCreado) {
                        if (err) {
                            siguiente(err);
                            return;
                        }
                        siguiente();
                    });
                }, function(err) {
                    if (err) {
                        reject("Se ha producido un error al cargar anuncios", err);
                    } else {
                        resolve(console.log('Anuncios cargados'));
                    }
                });
            });
        });
    }
    eliminaUsuarios()
        .then(cargaUsuarios)
        .then(eliminaAnuncios)
        .then(cargaAnuncios)
        .then(function() {
            process.exit();
        })
        .catch(function(err) {
            console.log("Error", err);
            process.exit();
        });
