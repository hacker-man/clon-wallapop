angular.module("babelpop").controller("headerCtrl", ["$scope","$location","$rootScope", "$auth", "$state", 
    "states", "userDataStorage", function($scope,$location,$rootScope, $auth, $state, states, userDataStorage) {

    // Modelo de usuario
    $scope.userName = "";
    $scope.profilePicture = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg";
    $scope.title = "";
    // Categorías en el dropdown de búsqueda
    $scope.categories = [];
    $scope.categories.push("CAT1");
    $scope.categories.push("CAT2");
    $scope.categories.push("CAT3");
    $scope.categories.push("CAT4");
    $scope.categories.push("CAT5");
    $scope.categories.push("CAT6");
    $scope.categories.push("CAT7");
    $scope.categories.push("CAT8");
    $scope.categories.push("CAT9");
    $scope.categories.push("CAT10");
    $scope.categories.push("CAT11");
    $scope.categories.push("CAT12");

    // Función que redirige al home, ejecutada cuando se hace click sobre el logo
    $scope.logoClick = function() {
        $state.go(states.home);
    }

    // Evento disparado cuando se actualizan los datos del usuario
    $rootScope.$on("updateUserData", function() {
        $scope.setUserData();
    });

    $scope.filterByName = function(){
               $state.go(states.filterAdsName,{name:$scope.title});
               $scope.title = "";


    }
    // Función que carga en el header los datos del localStorage
    $scope.setUserData = function() {
        if ($auth.isAuthenticated()) {
            var data = userDataStorage.getUserData();
            $scope.userName = data.userName;
            $scope.profilePicture = data.profilePicture;
            $scope.userId = userDataStorage.getUserData().userId;
        }
    };
    // Inicialmente llamamos a la carga de datos del usuario
    $scope.setUserData();
}]);
