var express = require("express");
var request = require("request");
var service = require("../../lib/service");
var config = require("../../lib/config");
var jwt = require("jwt-simple");
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");



router.post("/facebook", function(req, res) {

  var fields = ["id", "email", "first_name", "last_name", "link", "name"];
  var accessTokenUrl = "https://graph.facebook.com/v2.5/oauth/access_token";
  var graphApiUrl = "https://graph.facebook.com/v2.5/me?fields=" + fields.join(",");
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header("Authorization")) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: "There is already a Facebook account that belongs to you" });
          }
          var token = req.header("Authorization").split(" ")[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findOne({facebook: payload.sub}, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: "User not found" });
            }
            user.facebook = profile.id;
            user.id = profile.id;
            user.rol = "user";
            user.email = profile.email;
            user.photoSocial = "https://graph.facebook.com/v2.3/" + profile.id + "/picture?type=large";
            user.name = user.displayName || profile.name;
            user.save(function() {
              var token = service.createToken(user);
              res.send({ token: token,photo:"https://graph.facebook.com/v2.3/" + profile.id + "/picture?type=large",
             name:profile.name,id:user._id,favAds:user.favAds });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = service.createToken(existingUser);
            return res.send({ token: token,photo:"https://graph.facebook.com/v2.3/" + profile.id + "/picture?type=large",
             name:profile.name,id:existingUser._id,favAds:existingUser.favAds  });
          }
          var user = new User();
          user.facebook = profile.id;
          user.photoSocial = "https://graph.facebook.com/v2.3/" + profile.id + "/picture?type=large";
          user.id = profile.id;
          user.email = profile.email;
          user.rol = "user";
          user.name = profile.name;
          user.save(function() {
            var token = service.createToken(user);
            res.send({ token: token,photo:"https://graph.facebook.com/v2.3/" + profile.id + "/picture?type=large",
             name:profile.name,id:user._id,favAds:user.favAds });
          });
        });
      }
    });
  });
});


router.post("/google", function(req, res) {
    var accessTokenUrl = "https://accounts.google.com/o/oauth2/token";
    var peopleApiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: "LxuqWdgA9gi-jakBabRoTee8",
        redirect_uri: req.body.redirectUri,
        grant_type: "authorization_code"
    };
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
        var accessToken = token.access_token;
        var headers = { Authorization: "Bearer " + accessToken };
        // Step 2. Retrieve profile information about the current user.
        request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
            if (profile.error) {
                return res.status(500).send({ message: profile.error.message });
            }
            // Step 3a. Link user accounts.
            if (req.header("Authorization")) {
                User.findOne({ google: profile.sub }, function(err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: "There is already a Google account that belongs to you" });
                    }
                    var token = req.header("Authorization").split(" ")[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findOne({google: payload.sub}, function(err, user) {
                        if (!user) {
                            return res.status(400).send({ message: "User not found" });
                        }
                        user.google = profile.sub;
                        user.photoSocial = profile.picture.replace("sz=50", "sz=200");
                        user.name = user.name || profile.name;
                        user.rol = "user";
                        user.gender = profile.gender;
                        user.email = profile.email;
                        user.id = profile.sub;
                        user.save(function() {
                            var token = service.createToken(user);
                            res.send({ token: token,photo:profile.picture.replace("sz=50", "sz=200"),name:profile.name,id:user._id ,favAds:user.favAds });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({ google: profile.sub }, function(err, existingUser) {
                    if (existingUser) {
                        return res.send({ token: service.createToken(existingUser),photo:profile.picture.replace("sz=50", "sz=200"),name:profile.name,id:existingUser._id,favAds:existingUser.favAds });
                    }
                    var user = new User();
                    user.google = profile.sub;
                    user.photoSocial = profile.picture.replace("sz=50", "sz=200");
                    user.email = profile.email;
                    user.gender = profile.gender;
                    user.rol = "user";
                    user.id = profile.sub;
                    user.name = profile.name;
                    user.save(function() {
                        var token = service.createToken(user);
                        res.send({ token: token,photo:profile.picture.replace("sz=50", "sz=200"),name:profile.name,id:user._id,favAds:user.favAds });
                    });
                });
            }
        });
    });
});

module.exports = router;
