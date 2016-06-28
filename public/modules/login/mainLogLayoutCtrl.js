angular.module("babelpop").controller("mainLogLayoutCtrl", ["$scope", "$auth", "$state", "states", "checkAuth", "userDataStorage", "errorHandler", function($scope, $auth, $state, states, checkAuth, userDataStorage, errorHandler) {

    // Comprueba que el usuario acceda únicamente si NO está logueado
    checkAuth.checkLogged();

    // Función encargada de autenticar a un usuario por google+ o facebook
    $scope.authenticate = function(provider) {
        // Petición al backend para loguear por google o facebook
        $auth.authenticate(provider)
            .then(function(data) {
                // Guardamos en el localStorage los datos del usuario
                userDataStorage.setUserData(data.data.name, data.data.photo, data.data.id, data.data.favAds);

                // Redirigimos al detalle del usuario
                $state.go(states.detailUser, { _id: userDataStorage.getUserData().userId });
            })
            .catch(function(response) {

                // Redirigimos a la página de error pertinente
                errorHandler.handle(response);
            })
    };

    // Redirección a la página de login por email
    $scope.login = function() {
        $state.go(states.customLogin);
    }

    // Redirección a la página de registro por email
    $scope.signup = function() {
        $state.go(states.customSignup);
    }

}]);
