angular.module("babelpop").controller("editProfileCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$state", "states", "apiPaths", "APIClient", "userDataStorage", "checkAuth", "Upload", "edituser", "errorHandler", function($scope, $rootScope, $filter, $timeout, $state, states, apiPaths, APIClient, userDataStorage, checkAuth, Upload, edituser, errorHandler) {

    // Comprueba que el usuario acceda únicamente si está logueado
    checkAuth.checkNotLogged();


    // Modelo de perfil de usuario
    $scope.userData = edituser.data;
    $scope.userId = $scope.userData._id;

    // Gestión de nombre y apellido
    var nameSplit = $scope.userData.name.split(" ");
    $scope.userData.name = nameSplit[0];
    $scope.userData.surname = "";
    for (var i = 1; i < nameSplit.length; i++) {
        if (i !== 1) {
            $scope.userData.surname += " ";
        }
        $scope.userData.surname += nameSplit[i];
    }

    // Gestión de fecha de nacimiento
    if ($scope.userData.birthDate !== undefined) {
        $scope.userData.birthDate = new Date($scope.userData.birthDate);
    }

    // Comprobamos si el usuario está logueado con google o con facebook
    if ($scope.userData.google || $scope.userData.facebook) {
        $scope.loggedWithForG = true;
    } else {
        $scope.loggedWithForG = false;
    }

    // Función encargada de subir la imagen de perfil
    $scope.uploadProfilePicture = function(dataUrl, name) {

        // Empezamos carga
        $scope.$emit("startLoadingState");

        // Guardamos la ruta donde se alojará la imagen de perfil
        var path = apiPaths.editProfilePicture + $scope.userData._id;

        // Petición PUT al backend para subir la imagen
        Upload.upload({
            url: path,
            method: "PUT",
            data: { avatar: Upload.dataUrltoBlob(dataUrl, name) },
        }).then(function(response) {
            // Guardamos la imagen en el dataStorage
            userDataStorage.setUserPicture(response.data.imageRoute);

            // Redirigimos al detalle de usuario
            $state.go(states.detailUser, { _id: $scope.userData._id });

            // Recargamos para actualizar la imagen de la cabecera
            location.reload();

            // Terminamos carga
            $scope.$emit("stopLoadingState");

        }).catch(function(error) {
            // Terminamos carga
            $scope.$emit("stopLoadingState");

            errorHandler.handle(error);
        });
    }

    // Función que marca el género seleccionado a hombre
    $scope.setMale = function(form) {
        $scope.gender = "male";

        // Marcamos el formulario como 'ensuciado'
        form.$pristine = false;
        form.$dirty = true;

        angular.element('#setFemaleButton').removeClass('active');
    }

    // Función que marca el género seleccionado a mujer
    $scope.setFemale = function(form) {
        $scope.gender = "female";

        // Marcamos el formulario como 'ensuciado'
        form.$pristine = false;
        form.$dirty = true;

        angular.element('#setMaleButton').removeClass('active');
    }

    // Función a ejecutar cuando se envia el formulario de edición de perfil
    $scope.submit = function(form) {
        var dataToPut = {};

        // Se parsea el nombre completo
        if (form.name.$modelValue.trim() !== "" && form.surname.$modelValue.trim() !== "") {
            dataToPut.name = form.name.$modelValue.trim() + " " + form.surname.$modelValue.trim();
            userDataStorage.setUserName(dataToPut.name);
        }

        // Se parsean los otros campos
        dataToPut.birthDate = form.birthDate.$modelValue || "";
        dataToPut.gender = $scope.gender || undefined;
        dataToPut.phone = form.phone.$modelValue || "";

        // Petición PUT al backend para actualizar el usuario
        APIClient.putUser($scope.userData._id, dataToPut);

        // Redirección a los detalles de usuario
        $state.go(states.detailUser, { _id: $scope.userData._id });
    }

    // Función a ejecutar cuando se envia el formulario de cambiar contraseña
    $scope.submitPass = function(form) {
        var dataToPut = {};

        // Si la nueva contraseña y su confirmación coinciden
        if (form.newPass.$modelValue === form.confirmPass.$modelValue) {
            dataToPut.prevPass = form.oldPass.$modelValue;
            dataToPut.pass = form.newPass.$modelValue;

            $scope.errorMessage = undefined;

            // Petición al backend para cambiar la contraseña
            APIClient.putPass($scope.userData._id, dataToPut).then(
                function() {

                    // Redirección al detalle de usuario
                    $state.go(states.detailUser, { _id: $scope.userData._id });
                },
                function(err) {

                    // Redirigimos a la página de error pertinente si es necesario
                    errorHandler.handle(err, [409]);

                    // Si no ha habido redirección ha sido un error controlado
                    if (err !== undefined) {
                        $scope.errorMessage = "EDITPROFILE.WRONGOLDPWD";
                    }
                });
        }
        // Si la nueva contraseña y su confirmación no coinciden
        else {
            $scope.errorMessage = "EDITPROFILE.WRONGNEWPWD";
        }
    }

    // Función a ejecutar cuando se envia el formulario de cambiar email
    $scope.submitEmail = function() {
        var dataToPut = {};
        dataToPut.email = $scope.userData.email;

        // Petición al backend para cambiar el email
        APIClient.putEmail($scope.userData._id, dataToPut).then(
            function() {

                // Redirección al detalle de usuario
                $state.go(states.detailUser, { _id: $scope.userData._id });
            },
            function(err) {
                // Redirigimos a la página de error pertinente
                errorHandler.handle(err);
            });
    }

    // Función a ejecutar cuando se desean cambiar las categorías
    $scope.submitCategories = function() {
        var dataToPut = {};
        dataToPut.favCat = $scope.userData.favCat;

        // Petición al backend para cambiar las categorías favoritas
        APIClient.putCategories($scope.userData._id, dataToPut).then(
            function() {

                // Redirección al detalle de usuario
                $state.go(states.detailUser, { _id: $scope.userData._id });
            },
            function(err) {
                // Redirigimos a la página de error pertinente
                errorHandler.handle(err);
            });
    }

    // Función que redirige a edición de ubicación
    $scope.redirectLocation = function() {
        $state.go(states.editLocation);
    }

    // Función que redirige a la página de perfil
    $scope.gotoProfile = function() {
        $state.go(states.detailUser, { _id: $scope.userData._id });
    }

    // Función que colapsa los paneles email y categorías favoritas
    $scope.collapsePass = function() {
        angular.element('#togglePass').addClass('active');
        angular.element('#toggleEmail').removeClass('active');
        angular.element('#toggleCat').removeClass('active');
        angular.element('#collapse2').collapse("hide");
        angular.element('#collapse3').collapse("hide");
    }

// Función que colapsa los paneles de cambiar contraseña y categorías favoritas
    $scope.collapseEmail = function() {
        angular.element('#togglePass').removeClass('active');
        angular.element('#toggleEmail').addClass('active');
        angular.element('#toggleCat').removeClass('active');
        angular.element('#collapse1').collapse("hide");
        angular.element('#collapse3').collapse("hide");
    }

// Función que colapsa los paneles email y cambiar contraseña
    $scope.collapseCat = function() {
        angular.element('#togglePass').removeClass('active');
        angular.element('#toggleEmail').removeClass('active');
        angular.element('#toggleCat').addClass('active');
        angular.element('#collapse1').collapse("hide");
        angular.element('#collapse2').collapse("hide");
    }

    // Inicializamos el array de categorías con el código de traducción
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
}]);
