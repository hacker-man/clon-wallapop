angular.module("babelpop").factory("chatSocket", ["socketFactory", function(socketFactory) {
    // Función creadora de sockets
    return  function() {

        // Creamos socket
        var socket = socketFactory();

        // Metemos los eventos socket en el digest loop de angular
        socket.forward("broadcast");

        return socket;
    };
}]);
