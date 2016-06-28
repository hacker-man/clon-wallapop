angular.module("babelpop").controller("customLoginCtrl", ["$auth", "$location", "$scope", "$state", "states", "userDataStorage", "errorHandler", function($auth, $location, $scope, $state, states, userDataStorage, errorHandler) {

    // Modelo de login
    $scope.model = {};

    // Función encargada de hacer login
    $scope.login = function() {

        // Empezamos carga
        $scope.$emit("startLoadingState");

        // Enviamos petición de login mediante satellizer
        $auth.login({
                email: $scope.model.email,
                pass: $scope.model.password
            })
            .then(function(data) {

                // Actualizamos el usuario guardado en el localStorage
                userDataStorage.setUserData(data.data.name, data.data.photo, data.data.id, data.data.favAds);

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Creamos socket
                $scope.$emit("bornSocket", data.data.id);

                // Redirigimos al detalle del usuario logueado
                $state.go(states.detailUser, { _id: userDataStorage.getUserData().userId });
            })
            .catch(function(response) {

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirigimos a la página de error pertinente si es necesario
                errorHandler.handle(response, [401]);

                // Si no ha habido redirección ha sido un error controlado
                $scope.logError = response.status;
            })
    };

    // Función que redirige a registro
    $scope.redirectSignup = function() {
        $state.go(states.customSignup);
    }

    // Función que redirige al formulario de contraseña olvidada
    $scope.goToRecover = function() {
        $state.go(states.forgotten);

    }
}]);
