angular.module("babelpop").controller("chatWindowCtrl", ["$log", "$scope", "chatSocket", "userDataStorage", "APIClient", "errorHandler", function($log, $scope, chatSocket, userDataStorage, APIClient, errorHandler) {

    var socket = chatSocket();
    $scope.messageLog = [];
    $scope.message = "";
    $scope.askerId = userDataStorage.getUserData().userId;
    $scope.askerUsername = userDataStorage.getUserData().userName;

    $scope.send_individual_msg = function() {
        $scope.message = $scope.message || "";
        if ($scope.message !== "") {
            socket.emit("check_user", $scope.askerId, $scope.room._id);
        }
    }

    // on connection to server, ask for user"s name with an anonymous callback
    socket.on("connect", function() {
        // call the server-side function "adduser" and send one parameter (value of prompt)

        socket.emit("adduser", $scope.askerId);
    });

    // Cuando el servidor envia el mensaje al que manda
    socket.on("msg_asker_handle", function(msg) {
        $scope.messageLog.push(msg);
    });

    // Cuando el servidor envia el mensaje al que recibe
    socket.on("msg_target_handle", function(msg) {
        $scope.messageLog.push(msg);
        $scope.$emit("newMessage", msg.user);
    });

    // listener, whenever the server emits "msg_user_found"
    socket.on("msg_user_found", function(targetId) {
        socket.emit("msg_user", targetId, $scope.askerId, $scope.askerUsername, $scope.message);
        $scope.message = "";
    });

    // Al conectarse y pedir todos los usuarios conectados
    socket.on("requestConnectedSockets", function(userList) {
        $scope.$emit("updateConnectedSockets", userList);
    });

    // Cuando se conecta un nuevo usuario
    socket.on("connectedSocket", function(newUser) {
        
        $scope.$emit("newSocketConnected", newUser);
    });

    // Cuando se desconecta un nuevo usuario
    socket.on("disconnectedSocket", function(newUser) {
 
        $scope.$emit("newSocketDisconnected", newUser);
    });

    $scope.$on("killSocket2", function() {
  
        socket.emit("kill");
    });

    $scope.$on("bornSocket2", function(event, userId) {
       
        socket.emit("adduser", userId);
    });

    $scope.$on("openedChat", function() {

        // Cargar mensajes del chat
        APIClient.getChatMessages(userDataStorage.getUserData().userId, $scope.room._id).then(function(data) {
            $scope.messageLog = data;
           

        }, function(err) {
            errorHandler.handle(err);
        });
    });

    $scope.$on("newChat2", function(event, data) {

        socket.emit("newChatRoom", data, userDataStorage.getUserData().userId);
    });

    socket.on("newChatRoom", function(newUser) {
       
        APIClient.getUser(newUser).then(
            function(data) {
                $scope.$emit("newChatRoom", data);
            },
            function(err) {
                errorHandler.handle(err);
            });
    });
}]);
