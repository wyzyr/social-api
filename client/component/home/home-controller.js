(function(window, angular, undefined){
    angular.module('sporent')
    .controller('homeCtrl', ['$scope', '$http', '$state', 'userSvc', function($scope, $http, $state, userSvc){
        
        
        
        var newUsernameInput = document.getElementById("newUserName");
        var newUserPassInput = document.getElementById("newUserPass");
        
        newUsernameInput.addEventListener('keyup', function(event){
            if(event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('createU').click();
            }
        });
        
        
        newUserPassInput.addEventListener('keyup', function(event){
            if(event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('createU').click();
            }
        });
        
        
        var usernameLogin = document.getElementById("loginName");
        var passwordLogin = document.getElementById("loginPass");
        
        usernameLogin.addEventListener('keyup', function(event){
            
                if(event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('loginBtn').click();
            }
            
        });
        
               passwordLogin.addEventListener('keyup', function(event){
            
                if(event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('loginBtn').click();
            }
            
        });
        
        
        
        
        $scope.createUser = function(user) {
            $http.post('/api/user/create', user).then(function(response){
                console.log(response)
            }, function(err){
                console.error(err);
            })
        };
        
        $scope.logUserIn = function(user){
            $http.post('/api/user/login', user).then(function(response){
                userSvc.token = response.data.token;
                userSvc.user = response.data.userData;
                localStorage.setItem('token', JSON.stringify(userSvc.token));
                localStorage.setItem('user', JSON.stringify(userSvc.user));
                $state.go('main');
                
            }, function(err){
                console.error(err);
            })
        };
        
        
    }])
})(window, window.angular);