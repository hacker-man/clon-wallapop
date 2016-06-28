angular.module("babelpop").controller("profileCtrl", ["$scope", "$rootScope", "$auth", "$location", "$filter", "$translate", "checkAuth", "userDataStorage", "APIClient", "$state", "states", "userdetail", "errorHandler", function($scope, $rootScope, $auth, $location, $filter, $translate, checkAuth, userDataStorage, APIClient, $state, states, userdetail, errorHandler) {

    // Datos del usuario particular que se está visitando
    $scope.userData = userdetail.data;

    // Guardamos identificador del usuario
    $scope.userId = $scope.userData._id;

    // Arrays con los anuncios vendidos, en venta y favoritos del usuario
    $scope.soldData = [];
    $scope.saleData = [];
    $scope.favAdsData = [];

    // Si el usuario no tiene imagen, se le asigna por defecto
    if ($scope.userData.photoSocial === undefined) {
        $scope.userData.photoSocial = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg";
    }

    // Filtramos la fecha para mostrarla en un formato user-friendly
    var Bday = $filter('date')($scope.userData.birthDate, "dd/MM/yyyy") || "-";
    var gender = $scope.userData.gender || "-";
    var phone = $scope.userData.phone || "-";

    // Traducción del texto contenido en las tooltips de los botones con información del usuario
    // Traducción del cumpleaños
    $translate('PROFILE.TOOLTIP.BIRTHDAY').then(
        function(translation) {
            $scope.birthday = translation + Bday;
            // Traducción del género
            $translate('PROFILE.TOOLTIP.GENDER').then(
                function(translation) {
                    $scope.gender = translation + gender;
                    // Traducción del teléfono
                    $translate('PROFILE.TOOLTIP.PHONE').then(
                        function(translation) {
                            $scope.phone = translation + phone;
                            // Traducción de la ubicación
                            $translate('PROFILE.TOOLTIP.LOCATION').then(
                                function(translation) {
                                    $scope.location = translation;

                                    // Asignamos las traducciones al tootltip
                                    $scope.tooltip = {
                                        birthday: $scope.birthday,
                                        location: $scope.location,
                                        gender: $scope.gender,
                                        phone: $scope.phone
                                    }
                                });
                        });
                });
        }
    );

    // Petición al backend para tomar los anuncios vendidos por el usuario
    APIClient.getUserSold($scope.userData._id).then(
        function(data) {
            $scope.soldData = data;
        },
        function(error) {
            // Redirigimos a la página de error pertinente
            errorHandler.handle(error);
        }
    );


    // Petición al backend para tomar los anuncios en venta del usuario
    APIClient.getUserSale($scope.userData._id).then(
        function(data) {
            $scope.saleData = data;
        },
        function(error) {
            // Redirigimos a la página de error pertinente
            errorHandler.handle(error);
        }
    );

    // Petición al backend para tomar los anuncios marcados como favorito por el usuario
    APIClient.getUserFavAds($scope.userData._id).then(
        function(data) {
            $scope.favAdsData = data;
        },
        function(error) {
            // Redirigimos a la página de error pertinente
            errorHandler.handle(error);
        }
    );

    // Función encargada de detectar si el usuario puede editar el perfil
    $scope.canIEdit = function() {
        // Si el usuario está logueado y coincide con el usuario que está viendo
        return $auth.isAuthenticated() && userDataStorage.getUserData().userId === $scope.userData._id;
    };

    // Redirección a la página de editar perfil
    $scope.gotoEdit = function() {
        $state.go(states.editProfile, { _id: $scope.userId });
    };

    // Redirección a la página de crear anuncio
    $scope.gotoCreateAd = function() {
        $state.go(states.createAd);
    };

    // Función ejecutada al pasar con el ratón por encima de la imagen de perfil
    $scope.mouseEnterProfilePicture = function() {
        angular.element(".btn-profile-picture-edit").addClass("hover");
    };

    // Función ejecutada al pasar con el ratón por encima de la imagen de perfil
    $scope.mouseLeaveProfilePicture = function() {
        angular.element(".btn-profile-picture-edit").removeClass("hover");
    };

    // JQuery cuando el documento está cargado
    $(document).ready(function() {

        // Tooltips handling
        $('[data-toggle=tooltip1]').hover(function() {
            // on mouseenter
            $(this).tooltip('show');
        }, function() {
            // on mouseleave
            $(this).tooltip('hide');
        });
        $('[data-toggle=tooltip2]').hover(function() {
            $(this).tooltip('show');
        }, function() {
            $(this).tooltip('hide');
        });
        $('[data-toggle=tooltip3]').hover(function() {
            $(this).tooltip('show');
        }, function() {
            $(this).tooltip('hide');
        });
        $('[data-toggle=tooltip4]').hover(function() {
            $(this).tooltip('show');
        }, function() {
            $(this).tooltip('hide');
        });
    });

    // Ejecución a ejecutar cuando se hace click sobre el panel de vendido
    $scope.collapseSale = function() {

        // Desmarcamos y plegamos el resto de paneles
        angular.element("#toggleSale").addClass("active");
        angular.element("#toggleSold").removeClass("active");
        angular.element("#toggleReviews").removeClass("active");
        angular.element("#toggleFavAds").removeClass("active");

        angular.element("#collapse2").collapse("hide");
        angular.element("#collapse3").collapse("hide");
        angular.element("#collapse4").collapse("hide");
    };

    // Ejecución a ejecutar cuando se hace click sobre el panel de en venta
    $scope.collapseSold = function() {

        // Desmarcamos y plegamos el resto de paneles
        angular.element("#toggleSale").removeClass("active");
        angular.element("#toggleSold").addClass("active");
        angular.element("#toggleReviews").removeClass("active");
        angular.element("#toggleFavAds").removeClass("active");

        angular.element("#collapse1").collapse("hide");
        angular.element("#collapse3").collapse("hide");
        angular.element("#collapse4").collapse("hide");
    };

    // Ejecución a ejecutar cuando se hace click sobre el panel de comentarios
    $scope.collapseReviews = function() {

        // Desmarcamos y plegamos el resto de paneles
        angular.element("#toggleSale").removeClass("active");
        angular.element("#toggleSold").removeClass("active");
        angular.element("#toggleReviews").addClass("active");
        angular.element("#toggleFavAds").removeClass("active");

        angular.element("#collapse1").collapse("hide");
        angular.element("#collapse2").collapse("hide");
        angular.element("#collapse4").collapse("hide");
    };

    // Ejecución a ejecutar cuando se hace click sobre el panel de anuncios favoritos
    $scope.collapseFavAds = function() {

        // Desmarcamos y plegamos el resto de paneles
        angular.element("#toggleSale").removeClass("active");
        angular.element("#toggleSold").removeClass("active");
        angular.element("#toggleReviews").removeClass("active");
        angular.element("#toggleFavAds").addClass("active");

        angular.element("#collapse1").collapse("hide");
        angular.element("#collapse2").collapse("hide");
        angular.element("#collapse3").collapse("hide");
    };

    // Función que redirecciona a editar anuncio
    $scope.gotoEditAd = function(ad) {
        // Guardamos en localStorage el anuncio a editar
        userDataStorage.setEditAd(ad);

        // Redirigimos a la página de editar anuncio
        $state.go(states.editAd);
    };

    // Función encargada de borrar un anuncio
    $scope.deleteAd = function(ad) {

        // Antes de borrar un anuncio aparece un dialogo preguntando si está seguro
        // Si el usuario cancela: no pasa nada
        // Si el usuario acepta:
        var user_id = userDataStorage.getUserId();
        var ad_id = ad._id;

        // Petición PUT al backend para borrar el anuncio
        // Se hace PUT en vez de DELETE para poder pasar como parámetros los id de anuncio y usuario
        APIClient.deleteAd(user_id, ad_id).then(
            function(data) {
                // Se quita este 'item' del modelo $scope.userData.sale y de los favoritos si lo tiene
                $scope.userData = data.data[0];

                APIClient.getUserSold($scope.userData._id).then(
                    function(data) {
                        $scope.soldData = data;

                        APIClient.getUserSale($scope.userData._id).then(
                            function(data) {
                                $scope.saleData = data;
                                APIClient.getUserFavAds($scope.userData._id).then(
                                    function(data) {
                                        $scope.favAdsData = data;
                                    },
                                    function(error) {
                                        // Redirigimos a la página de error pertinente
                                        errorHandler.handle(error);
                                    }
                                );
                            },
                            function(error) {
                                // Redirigimos a la página de error pertinente
                                errorHandler.handle(error);
                            }
                        );
                    },
                    function(error) {
                        // Redirigimos a la página de error pertinente
                        errorHandler.handle(error);
                    }
                );
            },
            function(error) {
                errorHandler.handle(error);
            }
        );
    }

    // Centro del mapa de ubicación y zoom por defecto
    $scope.cnt1;
    $scope.cnt2;
    $scope.zoom = 11;

    // Si el usuario tiene la ubicación por coordenadas
    if ($scope.userData.latitude !== '' && $scope.userData.latitude !== null && $scope.userData.latitude !== undefined) {
        $scope.cnt1 = $scope.userData.latitude;
        $scope.cnt2 = $scope.userData.longitude;
    }
    // Si el usuario tiene la ubicación por dirección
    else if ($scope.userData.livingArea !== '' && $scope.userData.livingArea !== null && $scope.userData.livingArea !== undefined) {
        $scope.cnt1 = $scope.userData.livingArea;
        $scope.cnt2 = $scope.userData.livingArea;
    }
    // Si el usuario no tiene ubicación, mostramos el mapa completo
    else {
        $scope.zoom = 1;
    }

    $scope.chat = function() {
        APIClient.isNewChat(userDataStorage.getUserData().userId, $scope.userId).then(
            function(isNew) {
                if (isNew) {
                    APIClient.newChat(userDataStorage.getUserData().userId, $scope.userId).then(
                        function(data) {
                            // añadir nuevo chat por el socket
                            $scope.$emit("openChats", $scope.userData);
                            $scope.$emit("newChat", $scope.userData);
                        },
                        function(err) {
                            console.log("ERROR AL CREAR NUEVO CHAT");
                        });
                } else {
                    $scope.$emit("openChats", $scope.userData);
                }
            },
            function(err) {
                errorHandler.handle(err);
            }
        );
    }

}]);
