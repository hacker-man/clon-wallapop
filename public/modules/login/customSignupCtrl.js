angular.module("babelpop").controller("customSignupCtrl", ["$auth", "$location", "$scope", "$state", "states", "checkAuth", "userDataStorage", function($auth, $location, $scope, $state, states, checkAuth, userDataStorage) {

    // Comprueba que el usuario acceda únicamente si NO está logueado
    checkAuth.checkLogged();

    // Modelo del usuario
    $scope.model = {};

    // Función a ejecutar cuando se procede a registrarse
    $scope.signup = function() {

        // Empezamos a cargar
        $scope.$emit("startLoadingState");

        // Petición al servidor para registrarse
        $auth.signup({
                name: $scope.model.name,
                email: $scope.model.email,
                pass: $scope.model.password
            })
            .then(function() {

                //  Petición al servidor para loguearse
                $auth.login({
                        email: $scope.model.email,
                        pass: $scope.model.password
                    })
                    .then(function(data) {

                        // Actualizamos el usuario en el localStorage
                        userDataStorage.setUserData(data.data.name, data.data.photo, data.data.id);

                        // Terminamos carga
                        $scope.$emit("stopLoadingState");

                        // Creamos socket
                        $scope.$emit("bornSocket", data.data.id);

                        // Redirigimos a detalle de usuario
                        $state.go(states.detailUser, { _id: data.data.id });
                    })
                    .catch(function(response) {

                        // Terminamos carga
                        $scope.$emit("stopLoadingState");

                        // Actualizamos el error
                        $scope.logError = response.status;
                    })
            })
            .catch(function(response) {

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Actualizamos el error
                $scope.logError = response.status;
            });
    }

    // Funcion que redirige a login
    $scope.redirectLogin = function() {
        $state.go(states.customLogin);
    }
}]);
