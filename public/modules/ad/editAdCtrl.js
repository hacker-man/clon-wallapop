angular.module("babelpop").controller("editAdCtrl", ["$scope", "$state", "states", "checkAuth", "userDataStorage", "Upload", "apiPaths", "$timeout", "APIClient", "errorHandler", function($scope, $state, states, checkAuth, userDataStorage, Upload, apiPaths, $timeout, APIClient, errorHandler) {

    // Comprueba que el usuario acceda únicamente si está logueado
    checkAuth.checkNotLogged();

    // Modelo de anuncio
    $scope.model = {};
    $scope.model.ad = userDataStorage.getEditAd();
    $scope.picFile = $scope.model.ad.image;

    // Mensaje de error
    $scope.errorMessage = "";

    // Función a ejecutar cuando se procede a modificar el anuncio
    $scope.editAdForm = function(purchaserId) {

        $scope.errorMessage = "";
        $scope.model.successAd = false;

        // Rellenamos todos los datos
        var ad = {};
        ad['title'] = $scope.model.ad.title;
        ad['detail'] = $scope.model.ad.detail;
        ad['price'] = $scope.model.ad.price;
        ad['badge'] = $scope.model.ad.badge;
        ad['category'] = $scope.model.ad.category;
        ad['tags'] = [];

        $scope.model.tag1 = $scope.model.tag1 || undefined;
        $scope.model.tag2 = $scope.model.tag2 || undefined;
        $scope.model.tag3 = $scope.model.tag3 || undefined;
        $scope.model.tag4 = $scope.model.tag4 || undefined;
        $scope.model.tag5 = $scope.model.tag5 || undefined;

        if ($scope.model.ad.tags[0] !== undefined) {
            ad['tags'].push($scope.model.ad.tags[0]);
        }
        if ($scope.model.ad.tags[1] !== undefined) {
            ad['tags'].push($scope.model.ad.tags[1]);
        }
        if ($scope.model.ad.tags[2] !== undefined) {
            ad['tags'].push($scope.model.ad.tags[2]);
        }
        if ($scope.model.ad.tags[3] !== undefined) {
            ad['tags'].push($scope.model.ad.tags[3]);
        }
        if ($scope.model.ad.tags[4] !== undefined) {
            ad['tags'].push($scope.model.ad.tags[4]);
        }

        ad['exchanges'] = $scope.model.ad.exchanges || false;
        ad['negotiable'] = $scope.model.ad.negotiable || false;
        ad['shipments'] = $scope.model.ad.shipments || false;

        ad['owner'] = userDataStorage.getUserData().userName;
        ad['ownerId'] = userDataStorage.getUserData().userId;

        ad['adId'] = $scope.model.ad._id;
        ad['userId'] = userDataStorage.getUserData().userId;
        ad['sold'] = $scope.model.ad.sold;

        // Si hay comprador, se añade campo al modelo
        $scope.model.ad.purchaser = $scope.model.ad.purchaser || undefined;
        if ($scope.model.ad.purchaser !== undefined) {
            ad['purchaser'] = $scope.model.ad.purchaser;
        }
        if ($scope.model.ad.sold === false) {
            ad['purchaser'] = "";
        }

        // Empezamos carga
        $scope.$emit("startLoadingState");

        // Si envia archivo valido
        if ($scope.picFile.type === "image/png" || $scope.picFile.type === "image/jpeg" || $scope.picFile.type === "image/jpg") {
            this.uploadPic($scope.picFile, ad, purchaserId);
        }
        // Si no envia archivo
        else if ($scope.picFile !== undefined) {
            var data = {
                ad: ad,
                purchaserId: purchaserId,
                userId: userDataStorage.getUserData().userId
            }

            // Petición al backend para editar anuncio
            APIClient.apiPutRequest(apiPaths.editAd, data).then(function() {

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirigimos a la página de anuncios
                $state.go(states.ads);
            }).catch(function(error) {

                // Redirigimos a la página de error pertinente si es necesario
                errorHandler.handle(error, [409]);

                // Si no ha habido redirección ha sido un error controlado
                if (error !== undefined) {
                    $scope.errorHandling(error);
                }

                // Terminamos carga
                $scope.$emit("stopLoadingState");
            });
        }
    };

    // Función encargada de editar el anuncio cuando se cambia la imagen
    $scope.uploadPic = function(file, ad, purchaserId) {

        // Enviamos petición al back para subir anuncio
        file.upload = Upload.upload({
            url: apiPaths.editAd,
            data: { description: file, ad: ad, purchaserId: purchaserId },
            method: 'PUT'
        });

        // Tras haber obtenido una respuesta
        file.upload.then(function(response) {

            // Guardamos resultado
            file.result = response.data;

            // Terminamos carga
            $scope.$emit("stopLoadingState");

            // Redirigimos a la página de anuncios
            $state.go(states.ads);

        }).catch(function(error) {

            // Redirigimos a la página de error pertinente si es necesario
            errorHandler.handle(error, [409]);

            // Si no ha habido redirección ha sido un error controlado
            $scope.errorHandling(error.data);

            // Terminamos carga
            $scope.$emit("stopLoadingState");
        });
    }

    // Función que maneja los errores controlados
    $scope.errorHandling = function(error) {

        // Mensaje de error en formato traducción
        $scope.errorMessage = error.translation;

        // Posibles usuarios compradores encontrados
        $scope.foundUsers = error.users;

        // Si se han encontrado varios usuarios con el mismo nombre
        if (error.users !== undefined) {

            // Si los usuarios no tienen foto o rating, se les añade por defecto.
            for (var i = 0; i < error.users.length; i++) {
                if (error.users[i].photoSocial === undefined) {
                    error.users[i].photoSocial = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg";
                }
                if (error.users[i].rating === undefined) {
                    error.users[i].rating = 0;
                }
            }
        }
    }
}]);
