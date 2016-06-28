angular.module("babelpop").service("errorHandler", ["$state", "states",
    function($state, states) {

        // Si el error es distinto del segundo parametro, comprobamos el tipo de error que es y redirigimos
        this.handle = function(error, handled) {

            var handledCode = false;

            // Si hay algun codigo que manejar
            if (handled !== undefined) {

                // Recorremos la lista de errores controlados
                for (var i = 0; i < handled.length; i++) {
                    if (error.code === handled[i]) {
                        handledCode = true;
                        break;
                    }
                }

            }

            // Si no se trata de un error controlado
            if (!handledCode) {

                // error 404
                if (error.code === 404) {
                    $state.go(states.error404);
                }
                // error 500
                else if (error.code === 500) {
                    $state.go(states.error500);
                }
                // error desconocido
                else if (error.code !== undefined && error.code !== null) {
                    $state.go(states.errorUnknown);
                }
            }
        };
    }
]);
