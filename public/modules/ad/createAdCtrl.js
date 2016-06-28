angular.module("babelpop").controller("createAdCtrl", ["$scope", "$state", "states", "APIClient", "checkAuth", "Upload", "apiPaths", "$timeout", "userDataStorage", "errorHandler", function($scope, $state, states, APIClient, checkAuth, Upload, apiPaths, $timeout, userDataStorage, errorHandler) {

    // Comprueba que el usuario acceda únicamente si está logueado
    checkAuth.checkNotLogged();

    // Modelo de anuncio
    $scope.model = {};
    $scope.model.successAd = false;
    $scope.model.exchange = false;
    $scope.model.negotiable = false;
    $scope.model.send = false;

    // Función a ejecutar cuando se procede a crear el anuncio
    $scope.createAdForm = function() {
        $scope.model.successAd = false;

        // Rellenamos todos los datos
        var ad = {};
        ad['title'] = $scope.model.title;
        ad['detail'] = $scope.model.detail;
        ad['price'] = $scope.model.price;
        ad['badge'] = $scope.model.currency;
        ad['category'] = $scope.model.category;
        ad['tags'] = [];

        $scope.model.tag1 = $scope.model.tag1 || undefined;
        $scope.model.tag2 = $scope.model.tag2 || undefined;
        $scope.model.tag3 = $scope.model.tag3 || undefined;
        $scope.model.tag4 = $scope.model.tag4 || undefined;
        $scope.model.tag5 = $scope.model.tag5 || undefined;

        if ($scope.model.tag1 !== undefined) {
            ad['tags'].push($scope.model.tag1);
        }
        if ($scope.model.tag2 !== undefined) {
            ad['tags'].push($scope.model.tag2);
        }
        if ($scope.model.tag3 !== undefined) {
            ad['tags'].push($scope.model.tag3);
        }
        if ($scope.model.tag4 !== undefined) {
            ad['tags'].push($scope.model.tag4);
        }
        if ($scope.model.tag5 !== undefined) {
            ad['tags'].push($scope.model.tag5);
        }

        ad['exchanges'] = $scope.model.exchange || false;
        ad['negotiable'] = $scope.model.negotiable || false;
        ad['shipments'] = $scope.model.send || false;

        ad['owner'] = userDataStorage.getUserData().userName;
        ad['ownerId'] = userDataStorage.getUserData().userId;

        var self = this;
        // Realizamos getUserDetail para obtener los datos
        APIClient.getUserDetail(userDataStorage.getUserData().userId).then(
            function(data) {
                // Anadimos la ubicación del anuncio
                ad['latitude'] = data.latitude;
                ad['longitude'] = data.longitude;

                // Enviamos a la funcion uploadPic el anuncio creado y la imagen
                self.uploadPic($scope.picFile, ad);
            },
            function(err) {

                // Redirigimos a la página de error pertinente si es necesario
                errorHandler.handle(err, [500]);
            });
    };

    // Función encargada de subir la imagen y crear el anuncio
    $scope.uploadPic = function(file, ad) {

        // Empezamos carga
        $scope.$emit("startLoadingState");

        // Enviamos petición al back para subir anuncio
        file.upload = Upload.upload({
            url: apiPaths.createAd,
            data: { description: file, ad: ad }
        });

        // Tras haber obtenido una respuesta
        file.upload.then(function(response) {
            $timeout(function() {
                // Guardamos resultado
                file.result = response.data;

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirigimos a la página de anuncios
                $state.go(states.ads);
            });
        }).catch(function(error) {
            // Terminamos carga
            $scope.$emit("stopLoadingState");

            // Redirigimos a la página de error pertinente
            errorHandler.handle(error);
        });
    }
}]);
