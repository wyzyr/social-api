(function(window, angular, undefined){
    angular.module('sporent')
     .controller('topNavCtrl',['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http){
         
 
         $scope.writeHi = function(){
             
             window.location ='#/';
         }
     }])
        
                              
                              
    .directive('topNav', [function(){
        return {
            restrict: 'E',
            scope: {},          
            templateUrl: '/client/component/shared/directives/top-nav/top-nav.html',
            link: function(scope, elem, attrs){
                
                
            }
        }
    }])
})(window,window.angular)