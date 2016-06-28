angular.module("babelpop").service("APIClient", ["$http", "$q", "apiPaths", "userDataStorage",
    function($http, $q, apiPaths, userDataStorage) {

        this.apiGetRequest = function(url) {
            var deferred = $q.defer();
            $http.get(url).then(
                function(response) {
                    //Resolvemos promesa
                    deferred.resolve(response.data);
                },
                function(response) {
                    //Rechazar promesa
                    deferred.reject(response.data);
                }
            );
            //Devolver promesa
            return deferred.promise;
        };

        this.apiPostRequest = function(url, data) {
            var deferred = $q.defer();

            $http.post(url, data).then(
                function(response) {
                    //Resolvemos promesa
                    deferred.resolve(response.data);
                },
                function(response) {
                    //Rechazar promesa
                    deferred.reject(response.data);
                }
            );
            //Devolver promesa
            return deferred.promise;
        };

        this.apiPutRequest = function(url, data) {
            var deferred = $q.defer();
            $http.put(url, data).then(
                function(response) {
                    //Resolvemos promesa
                    deferred.resolve(response.data);
                },
                function(response) {
                    //Rechazar promesa
                    deferred.reject(response.data);
                }
            );
            //Devolver promesa
            return deferred.promise;
        };


        this.updateLocation = function(location) {
            var deffered = $q.defer();
            var id = userDataStorage.getUserId();
            /*Update views*/
            $http.put(apiPaths.putLocation + id, location).then(
                //peticion ok
                function(response) {
                    //resolver la promesa
                    deffered.resolve(response.data);
                },
                //peticion KO
                function(response) {
                    //rechazar la promesa
                    deffered.reject(response.data);
                }
            );
            return deffered.promise;
        };


        this.getLocation = function() {
            var id = userDataStorage.getUserId();
            return this.apiGetRequest(apiPaths.getLocation + id);
        };

        this.getUser = function(id) {
            return this.apiGetRequest(apiPaths.getUsers + id);
        };

        this.getUserDetail = function(id) {
            return this.apiGetRequest(apiPaths.getUser + id);
        };

        this.putAd = function(id, data) {
            return this.apiPutRequest(apiPaths.editAd + id, data);
        };
        this.putIdAd = function(id, data) {
            return this.apiPutRequest(apiPaths.pushIdAd + id, data);
        };
        this.putUser = function(id, data) {
            return this.apiPutRequest(apiPaths.editProfile + id, data);
        };

        this.putPass = function(id, data) {
            return this.apiPutRequest(apiPaths.editPass + id, data);
        };

        this.putEmail = function(id, data) {
            return this.apiPutRequest(apiPaths.editEmail + id, data);
        };
        this.putFavs = function(data) {
            return this.apiPutRequest(apiPaths.editFavs, data);
        };
        this.putCategories = function(id, data) {
            return this.apiPutRequest(apiPaths.editCat + id, data);
        };

        this.getUserSold = function(id) {
            return this.apiGetRequest(apiPaths.profileSold + id);
        };

        this.getUserSale = function(id) {
            return this.apiGetRequest(apiPaths.profileSale + id);
        };

        this.getUserFavAds = function(id) {
            return this.apiGetRequest(apiPaths.profileFavAds + id);
        };

        this.getAds = function(url) {
            return this.apiGetRequest(url);
        };
        this.getDetailAd = function(id) {
            return this.apiGetRequest(apiPaths.detailAd + id);
        };

        this.deleteAd = function(userId, adId) {
            var ids = {
                userId: userId,
                ad: adId
            };
            return this.apiPutRequest(apiPaths.deleteAd, ids);
        };

        this.filterByCategory = function(cat) {
            return this.apiGetRequest(apiPaths.categories + cat);
        };

        this.newChat = function(userId1, userId2) {
            var dataToPost = { userId1: userId1, userId2: userId2 };
            return this.apiPostRequest(apiPaths.newChat, dataToPost);
        };

        this.isNewChat = function(userId1, userId2) {
            var dataToPost = { userId1: userId1, userId2: userId2 };
            return this.apiPostRequest(apiPaths.isNewChat, dataToPost);
        };

        this.getChats = function(id) {
            return this.apiGetRequest(apiPaths.getChats + id);
        };

        this.getChatMessages = function(asker, target) {
            return this.apiGetRequest(apiPaths.getChatMessages + asker + "/" + target);
        };

        this.filterByCategory = function(cat) {
            return this.apiGetRequest(apiPaths.categories + cat);
        };

        this.filterByName = function(name) {
            return this.apiGetRequest(apiPaths.byName + name);
        };

        this.filterAdvanced = function(query){
            return this.apiGetRequest(query);
        };
    }
]);
