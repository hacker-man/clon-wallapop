angular.module("babelpop").service("userDataStorage", ["$rootScope", "$auth", function($rootScope, $auth) {

    this.setUserPicture = function(profilePicture) {
        if ($auth.isAuthenticated()) {
            profilePicture = profilePicture || undefined;
            if (profilePicture === undefined) {
                localStorage.setItem("profilePicture",
                    "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg");
            } else {
                localStorage.setItem("profilePicture", profilePicture);
            }
            $rootScope.$emit("updateUserData");
        }
    };
    this.setUserName = function(userName) {
        if ($auth.isAuthenticated()) {
            userName = userName || undefined;
            localStorage.setItem("userName", userName);
            $rootScope.$emit("updateUserData");
        }
    };
    this.setUserId = function(userId) {
        if ($auth.isAuthenticated()) {
            userId = userId || undefined;
            localStorage.setItem("userId", userId);
            $rootScope.$emit("updateUserData");
        }
    };
    this.setUserfavAds = function(favAds){
        if ($auth.isAuthenticated()) {
            favAds = favAds || undefined;
            localStorage.setItem("favAds", favAds);
            $rootScope.$emit("updateUserData");
        }
    };
    this.setUserData = function(userName, profilePicture, userId,favAds) {
        this.setUserPicture(profilePicture);
        this.setUserName(userName);
        this.setUserId(userId);
        this.setUserfavAds(favAds);
    };

    this.getUserData = function() {
        if ($auth.isAuthenticated()) {
            return {
                userName: localStorage.getItem("userName"),
                profilePicture: localStorage.getItem("profilePicture"),
                userId: localStorage.getItem("userId"),
                favAds: localStorage.getItem("favAds")

            };
        }
    };

    this.removeUserData = function() {
        if (!$auth.isAuthenticated()) {
            localStorage.removeItem("userName");
            localStorage.removeItem("profilePicture");
            localStorage.removeItem("userId");
            localStorage.removeItem("favAds");
        }
    };

    this.getUserId = function() {
        if ($auth.isAuthenticated()) {
            return localStorage.getItem("userId");
        }
    };


    this.getUserPicture = function() {
        if ($auth.isAuthenticated()) {
            return localStorage.getItem("profilePicture");
        }
    };


    this.setEditAd = function(ad){
        localStorage.setItem("ad", JSON.stringify(ad));
    };

    this.getEditAd = function(){
        return JSON.parse(localStorage.getItem("ad"));
    };
    
}]);
