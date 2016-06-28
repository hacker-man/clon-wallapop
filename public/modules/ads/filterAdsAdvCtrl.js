angular.module("babelpop").controller("filterAdsAdvCtrl", ["$scope", "$state", "$auth", "apiPaths", "APIClient",
    "userDataStorage", "checkAuth", "states", "errorHandler","filteradv",function($scope, $state, $auth, apiPaths, APIClient, userDataStorage, checkAuth, states, errorHandler,filteradv) {

    // Modelo de anuncios
    $scope.model = filteradv.data;
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
    }

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
    }

    $scope.backAds = function(){
        $state.go(states.ads);
    }
}]);
