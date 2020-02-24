(function(window, angular, undefined) {
        angular.module('sporent', ['ui.router'])
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
        $stateProvider.state('home', {
                url: '/',
                templateUrl: '/client/component/home/home.html',
                controller: 'homeCtrl'
            })
            .state('main',{
            url: '/main',
            templateUrl: '/client/component/main/main.html',
            controller: 'mainCtrl'
        })
        
        .state('profile', {
            url: '/profile',
            templateUrl: '/client/component/profile/profile.html',
            controller: 'profCtrl'
        })
        .state('user-profile', {
            url: '/user-profile',
            templateUrl: '/client/component/user-profile/user-profile.html',
            controller: 'userprofCtrl'
        })
        
        $urlRouterProvider.otherwise('/');
    }])
})(window, window.angular);