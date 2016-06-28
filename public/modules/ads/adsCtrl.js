angular.module("babelpop").controller("adsCtrl", ["$scope", "$state", "$auth", "apiPaths", "APIClient", "userDataStorage", "checkAuth", "states", "errorHandler", function($scope, $state, $auth, apiPaths, APIClient, userDataStorage, checkAuth, states, errorHandler) {

    // Modelo de anuncios
    $scope.model = [];
    $scope.favCat = [];
 
        // Empezamos carga

    $scope.$emit("startLoadingState");

    // Enviamos petición al back para cargar listado de anuncios
    APIClient.getAds(apiPaths.getAds).then(
        function(ads) {
            // Actualizamos modelo
            $scope.model = ads;
            // Terminamos carga
            $scope.$emit("stopLoadingState");
        },
        function(error) {
            // Terminamos carga
            $scope.$emit("stopLoadingState");

            errorHandler.handle(error);
        }
    );

    // Función que verifica si es un anuncio favorito
    $scope.isFav = function(item) {

        // Si el usuario está logueado
        if ($auth.isAuthenticated()) {
            var favAds = userDataStorage.getUserData().favAds;
            var flag = favAds.indexOf(item._id);
            if (flag < 0) {
                return false;
            } else {
                return true;
            }
        }
    };

    // Función que marca como favorito un anuncio
    $scope.iLikeIt = function(item) {

        // Si el usuario está logueado
        if ($auth.isAuthenticated()) {

            // Tomamos los favoritos del localStorage
            var favAds = userDataStorage.getUserData().favAds;
            favAds = favAds.split(",");
            var ids;
            // Si no es favorito
            if (favAds.indexOf(item._id) < 0) {

                // Añadimos favorito en el modelo
                favAds.push(item._id);
                item.likes = item.likes + 1;
                userDataStorage.setUserfavAds(favAds);

                // Añadimos favorito en el backend
                ids = { adId: item._id, id: userDataStorage.getUserData().userId };
                APIClient.putFavs(ids).then(
                    function() {},
                    function(error) {
                        // Redigirimos a la página de error pertinente
                        errorHandler.handle(error);
                    }
                );
            }
            // Si es favorito
            else {

                // Eliminamos favorito en el modelo
                favAds.splice(favAds.indexOf(item._id), 1);
                item.likes = item.likes - 1;
                userDataStorage.setUserfavAds(favAds);

                // Eliminamos favorito en el backend
                ids = { adId: item._id, id: userDataStorage.getUserData().userId };
                APIClient.putFavs(ids).then(
                    // Si la petición ha ido correctamente
                    function() {},
                    // Si la petición ha fallado
                    function(err) {
                        // Redigirimos a la página de error pertinente
                        errorHandler.handle(err);
                    }
                );
            }
        } // Si el usuario no está logueado
        else {
            // Redirige a la página de login
            $state.go(states.mainLogRedirect);
        }
    };

    $scope.collapse = function() {
        angular.element('#toggleAdv').addClass('active');
    };
    // Inicializamos el array de categorías con el código de traducción
    $scope.categories = [];
    $scope.categories.push("CAT1");
    $scope.categories.push("CAT2");
    $scope.categories.push("CAT3");
    $scope.categories.push("CAT4");
    $scope.categories.push("CAT5");
    $scope.categories.push("CAT6");
    $scope.categories.push("CAT7");
    $scope.categories.push("CAT8");
    $scope.categories.push("CAT9");
    $scope.categories.push("CAT10");
    $scope.categories.push("CAT11");
    $scope.categories.push("CAT12");

    $scope.goSearch = function(area, orden) {
        var categoria = "";
      
        var query = "/api/getAds?";
        for (var i in $scope.favCat) {
            categoria = $scope.favCat[i];
            if (i !== $scope.favCat.length - 1) {
                query += "category=" + categoria + "&";
            } else {
                query += "category=" + categoria;
            }
        }

        if (area !== undefined && $scope.favCat.length !== 0) {
            query += "&location=" + area;
        } else {

            if (area !== undefined && $scope.favCat.length === 0) {
                query += "location=" + area;
            }
        }

        if (orden !== undefined && ($scope.favCat.length !== 0 || area !== undefined)) {
            query += "&sort=" + orden;
        } else {
            if (orden !== undefined && $scope.favCat.length === 0 && area === undefined) {
                query += "sort=" + orden;
            }
        }

        if ($scope.model.min !== undefined && $scope.model.max === undefined && ($scope.favCat.length !== 0 || area !== undefined || orden !== undefined)) {
            
            query += "&price=" + $scope.model.min + "-"
        }else{
           if($scope.model.min !== undefined && $scope.model.max !== undefined && ($scope.favCat.length !== 0 || area !== undefined || orden !== undefined)) {
            query += "&price=" +  $scope.model.min + "-" + $scope.model.max;
           }
        }

        if ($scope.model.min !== undefined && $scope.model.max === undefined && $scope.favCat.length === 0 && area === undefined && orden === undefined) {
            query += "price=" + $scope.model.min + "-"
        } else {
            if ($scope.model.min !== undefined && $scope.model.max !== undefined && $scope.favCat.length === 0 && area === undefined && orden === undefined) {
                query += "price=" + $scope.model.min + "-" + $scope.model.max;
            }
        }



        if($scope.model.adName !== undefined && ($scope.model.min !== undefined || $scope.model.max === undefined ||
            $scope.favCat.length !== 0 || area !== undefined || orden !== undefined) ){
            query += "&title=" + $scope.model.adName;
        }else{
            if($scope.model.adName !== undefined && $scope.model.min === undefined && $scope.model.max === undefined &&
                $scope.favCat.length === 0 && area === undefined && orden === undefined){
                query += "title=" + $scope.model.adName;
            }
        }

    
        $state.go(states.advancedSearch, {cosas: query });
    }
}]);
