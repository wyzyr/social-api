(function(window, angular, undefined){
    angular.module('sporent')
    .controller('profCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc){
        
      /*  var ng = angular.module('sporent',['ngMaterial']);*/
        
        $scope.userData = userSvc.user;
       
        
        
        
        var config = {
            
            headers: {
            'auth-token': userSvc.token
            
            }
        }
        var rating;
                
        $scope.userFriends = [];
        $scope.users = [];
        $scope.friendComment = [];
        $scope.avg;
        
        
             $scope.goMain = function() {
        
            $state.go('main');
        
        }, function(err){
            console.log(err);
        }
             
             
        //Get friends posts
        $http.get('/secure-api/post/get_friend_comment', config).then(function(response){
            
            var total = 0;
            $scope.friendComment = response.data.data;
            for(var k=0; k < response.data.data.length;k++){
                total += response.data.data[k].rating;
            }
           $scope.avg = total / response.data.data.length;
            
                
        }, function(err){
            console.log(err);
        })
        
        
         $scope.goUserProf = function() {
            
             
            $state.go('user-profile');

             
        }, function(err){
            console.log(err);
        }
        
        
    $scope.updateRating = function(avg) {
        var requestData = {
            
            rating: avg
        }
        $http.post('secure-api/user/update_rating', requestData, config).then(function(response){
            console.log("Update rating")
        }, function(err){
            console.log(err);
        })
        
        
    }
   
    
     $scope.changeDetails = function(username,displayName,firstName,lastName){
            requestData = {
                content: username,
                display: displayName,
                first: firstName,
                last: lastName
            }
            $http.post('/secure-api/user/update-details', requestData, config).then(function(response){
                console.log("Details changed")
            }, function(err){
                console.log(err);
            })
        }
  
    
    
    
                
     $scope.respondToRequest = function(requestId, confirmation){
            
            var requestData = {
                
                'request_id': requestId,
                confirmation: confirmation
            }
            
            
            $http.post('/secure-api/user/request_friend_respond', requestData, config).then(function(response){
                console.log("user added to friends")
            }, function(err){
                console.log(err);
            })
        }
                
        
        
        $scope.addUser = function(userId){
            var requestData = {
                'receiver_Id': userId
            }
        
        
        
        $http.post('/secure-api/user/request_friend', requestData, config ).then(function(response){
            console.log("Friend request was sent")
        }, function(err){
            console.log(err);
        })
        }
        
        
  
        // get friend requests
        
        
        $http.get('/secure-api/user/get_friend_request', config).then(function(response){ 
        
            $scope.friendRequests = response.data.data;
        }, function(err){
            console.log(err);
        });
        
        
        $http({
            method: "GET", 
            url: '/secure-api/user/get_friends',
            headers: {
                'auth-token': userSvc.token
            }
            
        }).then(function(response){
            $scope.userFriends = response.data.data;
        }, function(err){
            console.err(err)
        })
        
       
        
        
                $http({
            method: "GET", 
            url: '/secure-api/user/get_users_by_quantity',
            headers: {
                'auth-token': userSvc.token
            }
            
        }).then(function(response){
            $scope.users = response.data.data;
        }, function(err){
            console.err(err)
        })
        
    }]);
})(window, window.angular)