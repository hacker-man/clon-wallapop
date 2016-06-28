angular.module('babelpop').controller('chatCtrl', ["$scope", "APIClient", "userDataStorage", "errorHandler", function($scope, APIClient, userDataStorage, errorHandler) {

    $scope.showUsers = true;

    $scope.room = 0;
    $scope.rooms = [];
    $scope.newChats = false;
    $scope.newMessages = 0;

    APIClient.getChats(userDataStorage.getUserData().userId).then(
        function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].userId2 === userDataStorage.getUserData().userId) {
                    APIClient.getUser(data[i].userId1).then(
                        function(data) {
                            data.newMessages = 0;
                            $scope.rooms.push(data);
                        },
                        function(err) {
                            errorHandler.handle(err);
                        });
                } else {
                    APIClient.getUser(data[i].userId2).then(
                        function(data) {
                            data.newMessages = 0;
                            $scope.rooms.push(data);
                        },
                        function(err) {
                            errorHandler.handle(err);
                        });
                }
            }
        },
        function(err) {
            errorHandler.handle(err);
        }
    );

    $scope.openChat = function(roomIndex) {
        $scope.newChats = false;
        $scope.showUsers = false;
        $scope.newMessages -= $scope.rooms[roomIndex].newMessages;
        $scope.rooms[roomIndex].newMessages = 0;
        $scope.room = $scope.rooms[roomIndex];
        $scope.$broadcast('openedChat');
    }

    $scope.closeChat = function() {
        $scope.showUsers = true;
        $scope.room = 0;
    }

    $scope.$on("openChats2", function(event, room) {
        angular.element('#collapseChat').collapse("show");
        $scope.rooms.push(room);
        $scope.openChat($scope.rooms.length - 1);
    });

    $scope.$on("newChatRoom", function(event, room) {
        room.connected = true;
        $scope.rooms.push(room);
        $scope.newChats = true;
    });

    $scope.$on("newMessage", function(event, fromUser) {
        
        var found = false;
        for (var i = 0; i < $scope.rooms.length && !found; i++) {
            if ($scope.rooms[i]._id === fromUser && $scope.room._id !== fromUser) {
                $scope.newMessages++;
                $scope.rooms[i].newMessages++;
            }
        }
    });

    $scope.$on("updateConnectedSockets", function(event, sockets) {
        
        var keys = Object.keys(sockets);
        var found;
        for (var i = 0; i < $scope.rooms.length; i++) {
            found = false;
            for (var j = 0; j < keys.length && !found; j++) {
                if ($scope.rooms[i]._id === keys[j]) {
                    $scope.rooms[i].connected = true;
                    found = true;
                }
            }
        }
    });

    $scope.$on("newSocketConnected", function(event, socketId) {
     
        var found = false;
        for (var i = 0; i < $scope.rooms.length && !found; i++) {
            if ($scope.rooms[i]._id === socketId) {
                $scope.rooms[i].connected = true;
                found = true;
            }
        }
    });

    $scope.$on("newSocketDisconnected", function(event, socketId) {
     
        var found = false;
        for (var i = 0; i < $scope.rooms.length && !found; i++) {
            if ($scope.rooms[i]._id === socketId) {
                $scope.rooms[i].connected = false;
                found = true;
            }
        }
    });
}]);
