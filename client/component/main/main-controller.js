(function (window, angular, undefined) {
    angular.module('sporent')
        .controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc', 'userProfSvc', function ($scope, $state, $http, userSvc, userProfSvc) {

            $scope.userData = userSvc.user;

            $scope.userProfile = userProfSvc.userProfId;


            var config = {

                headers: {
                    'auth-token': userSvc.token

                }
            };

            $scope.userFriends = [];
            $scope.users = [];
            $scope.newPost = undefined;
            $scope.friendPosts = [];
            $scope.userProf = [];


            $scope.goProfile = function () {

                $state.go('profile');

            }, function (err) {
                console.log(err);
            }
            $scope.goUserProf = function () {


                $state.go('user-profile');


            }, function (err) {
                console.log(err);
            }

            $scope.respondToRequest = function (requestId, confirmation) {

                var requestData = {

                    'request_id': requestId,
                    confirmation: confirmation
                }


                $http.post('/secure-api/user/request_friend_respond', requestData, config).then(function (response) {
                    console.log("user added to friends")
                }, function (err) {
                    console.log(err);
                })
            }

            /* MAPS OPTIONS */
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(51.759445, 19.457216),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }

            var map = new google.maps.Map(document.getElementById('map_go'), mapOptions);
            var marker = new google.maps.Marker({
                position: {lat: 51.759445, lng: 19.457216},
                map: map
            });

            $scope.markers = [];

            /* ADD MARK ON CLICK 
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map
          //icon:props.iconImage
        });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }         
        
         google.maps.event.addListener(map, 'click', function(event){
             addMarker({coords:event.latLng});
             
         });
            */

            var infoWindow = new google.maps.InfoWindow();

            var createMarker = function (info) {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.lat, info.long),
                    title: info.city
                });
                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);

                });

                $scope.markers.push(marker);

            }

            $scope.openInfoWindow = function (e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');

            }

            /* END OF MAP OPTIONS*/


            $scope.addUser = function (userId) {
                var requestData = {
                    'receiver_Id': userId
                }


                $http.post('/secure-api/user/request_friend', requestData, config).then(function (response) {
                    console.log("Friend request was sent")
                }, function (err) {
                    console.log(err);
                })
            }


            $scope.submitPost = function (content) {
                requestData = {
                    content: content
                }

                $http.post('/secure-api/post/create_post', requestData, config).then(function (response) {
                    $scope.nerPost = "";
                    console.log("Post submited")


                }, function (err) {
                    console.log(err);
                })
            }

            // get friend requests


            $http.get('/secure-api/user/get_friend_request', config).then(function (response) {

                $scope.friendRequests = response.data.data;

            }, function (err) {
                console.log(err);
            });

            //Get friends posts
            $http.get('/secure-api/post/get_friend_posts', config).then(function (response) {
                $scope.friendPosts = response.data.data;
            }, function (err) {
                console.log(err);
            })


            $http({
                method: "GET",
                url: '/secure-api/user/get_friends',
                headers: {
                    'auth-token': userSvc.token
                }

            }).then(function (response) {
                $scope.userFriends = response.data.data;
            }, function (err) {
                console.err(err)
            })


            $http({
                method: "GET",
                url: '/secure-api/user/get_users_by_quantity',
                headers: {
                    'auth-token': userSvc.token
                }

            }).then(function (response) {
                $scope.users = response.data.data;
            }, function (err) {
                console.err(err)
            });


            $scope.getUserProf = function (id) {
                // console.log(id);
                // var requestData = {
                //     userProfId: id
                // };
                // console.log(requestData);

                $http.get('/secure-api/user-profile/get-profile-id/' + id, ).then(function (response) {
                    $scope.userProfile = response.data.data;
                    console.log("Got user Id")
                }, function (err) {
                    console.log($scope.userProfile);
                    console.log(err);
                })
            }
        }])
})


(window, window.angular);