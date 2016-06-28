angular.module("babelpop", ["ui.router", "satellizer", "angularSpinner",
        "pascalprecht.translate", "ngFileUpload", "ngMap", "checklist-model",
        "frapontillo.bootstrap-switch", "ngFileUpload", "ngImgCrop", "btford.socket-io", "luegg.directives"
    ])
    .value("messageFormatter", function(date, nick, message) {
        return date.toLocaleTimeString() + " - " +
            nick + " - " +
            message + "\n";
    })
    .config(["$stateProvider", "$urlRouterProvider", "$authProvider", "paths",
        "states", "usSpinnerConfigProvider", "$translateProvider", "$httpProvider",
        function($stateProvider, $urlRouterProvider, $authProvider, paths,
            states, usSpinnerConfigProvider, $translateProvider, $httpProvider) {

            $urlRouterProvider.otherwise("/error404");
            $stateProvider
                .state(states.error404, {
                    url: paths.error404,
                    templateUrl: "../modules/error/error404.html"
                })
                .state(states.error500, {
                    url: paths.error500,
                    templateUrl: "../modules/error/error500.html"
                })
                .state(states.errorUnknown, {
                    url: paths.errorUnknown,
                    templateUrl: "../modules/error/errorUnknown.html"
                })
                .state(states.home, {
                    url: paths.home,
                    templateUrl: "../modules/home/home.html"
                })
                .state(states.root, {
                    url: paths.root,
                    templateUrl: "../modules/home/home.html"
                })
                .state(states.terms, {
                    url: paths.terms,
                    templateUrl: "../modules/terms/terms.html"
                })
                .state(states.privacy, {
                    url: paths.privacy,
                    templateUrl: "../modules/terms/privacy.html"
                })
                .state(states.mainLogLayout, {
                    templateUrl: "../modules/login/mainLogLayout.html"
                })
                .state(states.mainLog, {
                    url: paths.mainLog,
                    templateUrl: "../modules/login/mainLog.html",
                    parent: states.mainLogLayout
                })
                .state(states.mainLogRedirect, {
                    url: paths.mainLogRedirect,
                    templateUrl: "../modules/login/mainLogRedirect.html",
                    parent: states.mainLogLayout
                })
                .state(states.customLogLayout, {
                    templateUrl: "../modules/login/customLogLayout.html"
                })
                .state(states.customLogin, {
                    url: paths.customLogin,
                    templateUrl: "../modules/login/customLogin.html",
                    parent: states.customLogLayout
                })
                .state(states.customSignup, {
                    url: paths.customSignup,
                    templateUrl: "../modules/login/customSignup.html",
                    parent: states.customLogLayout
                })
                .state(states.privateLayout, {
                    templateUrl: "../modules/private/privateLayout.html"
                })
                .state(states.logout, {
                    url: paths.logout,
                    templateUrl: "../modules/logout/logout.html"
                }).state(states.detailUser, {
                    url: paths.detailUser,
                    params: {
                        _id: null
                    },
                    templateUrl: "../modules/profile/profile.html",
                    controller: "profileCtrl",
                    resolve: {
                        userdetail: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.getUser($stateParams._id).then(
                                function(data) {
                                    return { data: data };
                                },
                                function(err) {
                                    return { err: err };
                                }
                            );
                        }]
                    }
                }).state(states.createAd, {
                    url: paths.createAd,
                    templateUrl: "../modules/ad/createAd.html"
                }).state(states.editProfile, {
                    url: paths.editProfile,
                    params: {
                        _id: null
                    },
                    templateUrl: "../modules/profile/editProfile.html",
                    controller: "editProfileCtrl",
                    resolve: {
                        edituser: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.getUser($stateParams._id).then(
                                function(data) {
                                    return { data: data };
                                },
                                function(err) {
                                    return { err: err };
                                }
                            );
                        }]
                    }
                }).state(states.ads, {
                    url: paths.ads,
                    templateUrl: "../modules/ads/ads.html",
                    controller: "adsCtrl"
                }).state(states.filterAds, {
                    url: paths.filterAds,
                    params: {
                        cat: null
                    },
                    templateUrl: "../modules/ads/filterAds.html",
                    controller: "filterAdsCtrl",
                    resolve: {
                        filtcartego: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.filterByCategory($stateParams.cat).then(
                                function(data) {
                                    return { data: data };
                                },
                                function(err) {
                                    return { err: err };
                                }
                            );
                        }]
                    }
                }).state(states.filterAdsName, {
                    url: paths.filterAdsName,
                    params: {
                        name: null
                    },
                    templateUrl: "../modules/ads/filterAdsName.html",
                    controller: "filterAdsNameCtrl",
                    resolve: {
                        filtername: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.filterByName($stateParams.name).then(
                                function(data) {
                                    return { data: data };
                                },
                                function(err) {
                                    return { err: err };
                                }
                            );
                        }]
                    }
                }).state(states.editLocation, {
                    url: paths.editLocation,
                    templateUrl: "../modules/location/editLocation.html"

                }).state(states.editAd, {
                    url: paths.editAd,
                    templateUrl: "../modules/ad/editAd.html"
                }).state(states.detailAd, {
                    url: paths.detailAd,
                    params: {
                        _id: null
                    },
                    resolve: {
                        addetail: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.getDetailAd($stateParams._id).then(
                                function(ad) {
                                    //$scope.$emit("stopLoadingState");
                                    return { ad: ad };
                                },
                                function(err) {
                                    //$scope.$emit("stopLoadingState");
                                    return { err: err };
                                }
                            );
                        }]
                    },
                    templateUrl: "../modules/ad/detailAd.html",
                    controller: "detailAdCtrl"

                }).state(states.forgotten, {
                    url: paths.forgotten,
                    templateUrl: "../modules/login/forgotten.html"
                }).state(states.advancedSearch, {
                    url: paths.advancedSearch,
                    templateUrl: "../modules/ads/filterAdsAdv.html",
                    controller: "filterAdsAdvCtrl",
                    params: {
                        cosas: null
                    },
                    resolve: {
                        filteradv: ["$stateParams", "APIClient", function($stateParams, APIClient) {
                            return APIClient.filterAdvanced($stateParams.cosas).then(
                                function(data) {
                                    return { data: data };
                                },
                                function(err) {
                                    return { err: err };
                                }
                            );
                        }]
                    }
                });



            //authProvider configuration:
            $authProvider.loginUrl = "/api/login";
            $authProvider.signupUrl = "/api/signUp";
            $authProvider.tokenName = "token";
            $authProvider.tokenPrefix = "babelPop";

            $authProvider.facebook({
                clientId: "1026244750795684",
                url: "/api/auth/facebook"
            });

            $authProvider.google({
                clientId: "587284002320-dec99stb9tjtj3fehmf951sfe6v440gm.apps.googleusercontent.com",
                url: "/api/auth/google"
            });



            //usSpinnerConfigProvider configuration:
            usSpinnerConfigProvider.setDefaults({ position: "fixed" });
            usSpinnerConfigProvider.setTheme("bigBlue", { color: "#FF4081", radius: 20 });
            usSpinnerConfigProvider.setTheme("smallRed", { color: "red", radius: 6 });


            $translateProvider.useStaticFilesLoader({
                prefix: "dictionaries/locale-",
                suffix: ".json"
            }).preferredLanguage("es_ES");

            $translateProvider.useSanitizeValueStrategy("escape");

            $httpProvider.interceptors.push("httpRequestInterceptor");
        }
    ]);
