angular.module("babelpop").controller("editLocationCtrl", ["$scope", "checkAuth", "NgMap", "APIClient", "$state", "userDataStorage", "states", "errorHandler", function($scope, checkAuth, NgMap, APIClient, $state, userDataStorage, states, errorHandler) {

    // Comprueba que el usuario acceda únicamente si está logueado
    checkAuth.checkNotLogged();

    // Modelo del mapa
    $scope.writable = false;
    $scope.cnt1;
    $scope.cnt2;

    // Petición inicial al backend para tomar los datos de ubicación
    APIClient.getLocation().then(
        function(data) {

            // Ubicación obtenida
            var location = data;

            // Si se obtiene ubicación por coordenadas
            if (location.latitude != null && location.longitude != null) {
                $scope.lat = location.latitude;
                $scope.lng = location.longitude;
                $scope.cnt1 = $scope.lat;
                $scope.cnt2 = $scope.lng;
            }
            // Si no se obtiene ubicación
            else {

                // Opción por defecto (Madrid)
                $scope.lat = 40.439427;
                $scope.lng = -3.678786;
                $scope.cnt1 = $scope.lat;
                $scope.cnt2 = $scope.lng;
            }
        },
        function(error) {
            errorHandler.handle(error);
        }
    );

    // Función que añade marcador al mapa cuando se escribe dirección
    $scope.addMarker = function(event) {
        if ($scope.writable !== true) {
            var ll = event.latLng;
            $scope.lat = ll.lat();
            $scope.lng = ll.lng();
        }
    }

    // Función a ejecutar cuando se modifica la ubicación
    $scope.editLocation = function() {

        // Empezamos carga
        $scope.$emit("startLoadingState");

        var location = {};

        // Si el usuario desea introducir dirección
        if ($scope.writable === true) {
            location['livingArea'] = $scope.address;
            location['latitude'] = undefined;
            location['longitude'] = undefined;
        }
        // Si el usuario no desea introducir dirección
        else {
            location['livingArea'] = undefined;
            location['latitude'] = $scope.lat;
            location['longitude'] = $scope.lng;
        }
        // Petición al backend para actualizar la ubicación de un usuario
        APIClient.updateLocation(location).then(
            function() {
                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirección a edición de perfil
                $state.go(states.detailUser, { _id: userDataStorage.getUserData().userId });
            },
            function(error) {
                // Terminamos carga
                $scope.$emit("stopLoadingState");
                // Redirigimos a la página de error pertinente
                errorHandler.handle(error);
            }
        );
    }

    // Observador de cambios en la dirección
    $scope.$watch("address", function() {
        $scope.cnt1 = $scope.address;
        $scope.cnt2 = $scope.address;
    })
}]);
