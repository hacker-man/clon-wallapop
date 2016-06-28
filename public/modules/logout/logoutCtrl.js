angular.module("babelpop").controller("logoutCtrl", ["$auth", "$scope", "checkAuth", "$state", "states", "userDataStorage", "errorHandler", function($auth, $scope, checkAuth, $state, states, userDataStorage, errorHandler) {

    // Comprueba que el usuario acceda únicamente si está logueado
    checkAuth.checkNotLogged();

    // Función encargada de hacer logout
    $scope.logout = function() {

        // Empezamos carga
        $scope.$emit("startLoadingState");

        // Petición al backend para hacer logout
        $auth.logout()
            .then(function() {
                // Borramos todos los datos del localStorage
                userDataStorage.removeUserData();

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Matamos el socket
                $scope.$emit("killSocket");

                // Redirigimos a la página de anuncios principal
                $state.go(states.home);
            })
            .catch(function(response) {
                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirigimos a la página de error pertinente
                errorHandler.handle(response);
            })
    };

    // Redirección a la página principal
    $scope.stay = function() {
        $state.go(states.home);
    }
}]);
