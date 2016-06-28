angular.module("babelpop").controller("forgottenCtrl", ["$scope", "$state", "states", "apiPaths", "APIClient", "checkAuth", "errorHandler", function($scope, $state, states, apiPaths, APIClient, checkAuth, errorHandler) {

    // Modelo de recuperación de contraseña
    $scope.model = {};

    // Comprueba que el usuario acceda únicamente si NO está logueado
    checkAuth.checkLogged();

    // Función a ejecutar cuando se procede a enviar correo
    $scope.recoverPassword = function() {

        // Tomamos el idioma del usuario para mandar el correo
        var lang = localStorage.getItem("language");

        var data = {
            email: $scope.model.email,
            lang: lang
        }

        // Petición al backend para recuperar contraseña
        APIClient.apiPostRequest(apiPaths.forgotten, data).then(
            function() {

                // Redirección a login
                $state.go(states.customLogin);
            },
            function(error) {

                // Redirigimos a la página de error pertinente
                errorHandler.handle(error);
            }
        );

    }
}]);
