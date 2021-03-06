angular.module('pug', ['ionic', 'pug.authService', 'pug.auth', 'pug.userEventsService', 'pug.userEventsController', 'pug.map', 'creatingEvent', 'ngCordova', 'ionic-timepicker', 'pug.timeFormatService', 'pug.eventService'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'AuthController',
      templateUrl: 'views/login.html'
    })
    .state('signup', {
      url: '/signup',
      controller: 'AuthController',
      templateUrl: 'views/signup.html'
    })
    .state('intro', {
      url: '/intro',
      templateUrl: 'views/intro.html'
    })
    .state('tabs', {
      url: '/main',
      templateUrl: 'views/tabs-view.html',
      controller: 'AuthController'
    })
    .state('tabs.creatingEvent', {
      url: '/creatingEvent',
      views: {
        'creating-event-tab' : {
          controller: 'creatingEventController',
          templateUrl: 'views/creatingEvent.html',
        }
      },
      authenticate: true
    })
    .state('tabs.map', {
      url: '/map',
      views: {
        'map-tab' : {
          controller: 'MapController',
          templateUrl: 'views/map.html',
        }
      },
      authenticate: true
    })
    .state('tabs.userEvents', {
      url : '/userEvents',
      views: {
        'user-events-tab' : {
          controller : 'userEventsController',
          templateUrl : 'views/userEvents.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/main/map');

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  // Attaches token to any request to server so that server can validate requests 
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.pug');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $state, AuthService, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  // Check token in localStorage whenever angular state changes
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !AuthService.isAuth()){
      // User isn’t authenticated
      $state.transitionTo("intro");
      event.preventDefault(); 
    }
  });
});