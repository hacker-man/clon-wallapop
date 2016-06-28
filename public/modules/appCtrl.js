angular.module("babelpop").controller("appCtrl", ["$auth", "$scope", "$location", "usSpinnerService", "$state", "states", "$translate", "checkAuth", function($auth, $scope, $location, usSpinnerService, $state, states, $translate, checkAuth) {

    // Guardamos la ruta actual
    $scope.location = $location.path();

    // Estilo aplicado en index.html que evita eventos click
    $scope.loading = "";

    // Guardamos en el scope la funcion del servicio que comprueba si se está logueado
    $scope.isLogged = checkAuth.isLogged;

    // Tomamos el idioma del usuario guardado en el localStorage
    if (localStorage.getItem("language") !== undefined) {
        $translate.use(localStorage.getItem("language"));
    }

    // Función que comprueba si el usuario está logueado
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    // Función que determina si se debe mostrar el footer o no
    $scope.noFooter = function() {
        return $scope.location === "" ||
            $scope.location === "/" ||
            $scope.location === '/logout';
    };

    // Función a ejecutar al empezar carga
    $scope.startSpin = function() {
        usSpinnerService.spin('spinner-1');
        $scope.loading = "pointer-events: none;";
    }

    // Función a ejecutar al terminar carga
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.loading = "";
    }

    // Función que redirige a logout
    $scope.redirectLogout = function() {
        $state.go(states.logout);
    };

    // Manejador de evento al cambiar de ruta
    $scope.$on("$locationChangeSuccess", function() {
        $scope.location = $location.path();
    });

    // Manejador de evento de comenzar carga
    $scope.$on("startLoadingState", function() {
        $scope.startSpin();
    });

    // Manejador de evento de terminar carga
    $scope.$on("stopLoadingState", function() {
        $scope.stopSpin();
    });

    // Redirección a la página de anuncios
    $scope.mainButton = function() {
        $state.go(states.ads);
    }

    // Función a ejecutar cuando se cambia de idioma
    $scope.changeLanguage = function(key) {
        localStorage.setItem("language", key);
        $translate.use(key);
    };

    // Función que devuelve el idioma seleccionado
    $scope.getActualLanguage = function() {
        return $translate.use();
    };

    $scope.$on('bornSocket', function(event, userId) {
        $scope.$broadcast('bornSocket2', userId);
    });

    $scope.$on('killSocket', function(event, userId) {
        $scope.$broadcast('killSocket2', userId);
    });

    $scope.$on('openChats', function(event, room) {
        $scope.$broadcast('openChats2', room);
    });

    $scope.$on('newChat', function(event, data) {
        $scope.$broadcast('newChat2', data);
    });

}]);
