angular.module("babelpop").service("checkAuth", ["$auth", "$state", "states", function($auth, $state, states) {

    //Funcion que checkea si está autenticado. En caso de que no, redirige al usuario para que se logee
    this.checkNotLogged = function() {
        if (!$auth.isAuthenticated()) {
            $state.go(states.mainLogRedirect);
        }
    };

    //Funcion contraria, si el usuario está logeado, no le dejamos acceder a ciertas páginas
    this.checkLogged = function() {
        if ($auth.isAuthenticated()) {
            $state.go(states.root);
        }
    };

    // Función que devuelve true si está logueado y false en caso contrario
    this.isLogged = function() {
        if ($auth.isAuthenticated()) {
            return true;
        }
        else{
            return false;
        }
    };
}]);
