angular.module("babelpop").factory("httpRequestInterceptor", function() {
    return {
        request: function(config) {

            /*Interceptor para todas las peticiones http*/



            return config;
        }
    };
});
