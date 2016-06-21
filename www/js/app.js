angular.module('app', ['ionic','app.loginControllers','app.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

  //解决 Android Tab 样式问题
  $ionicConfigProvider.tabs.position('bottom'); // Tab位置
  $ionicConfigProvider.navBar.alignTitle('center'); // 标题位置

  $stateProvider

    .state('login', {
      url:'/login',
      templateUrl:'templates/login/login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      url:'/register',
      templateUrl:'templates/login/register.html',
      controller:'RegisterCtrl'
    })

    .state('rootTab', {
      url: '/rootTab',
      abstract: true,
      templateUrl: 'templates/rootTab/rootTab.html'
    })

    .state('rootTab.sightList', {
      url: '/sightList',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/rootTab/rootTab-sightList.html',
          controller: 'SightListCtrl'
        }
      }
    })

    .state('rootTab.nearby', {
      url: '/nearby',
      views: {
        'rootTab-nearby': {
          templateUrl: 'templates/rootTab/rootTab-nearby.html',
          controller: 'NearbyCtrl'
        }
      }
    })

    .state('rootTab.history', {
      url: '/history',
      views: {
        'rootTab-history': {
          templateUrl: 'templates/rootTab/rootTab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })

    .state('rootTab.route', {
      url: '/route',
      views: {
        'rootTab-route': {
          templateUrl: 'templates/rootTab/rootTab-route.html',
          controller: 'RouteCtrl'
        }
      }
    })

    .state('rootTab.mine', {
      url: '/mine',
      views: {
        'rootTab-mine': {
          templateUrl: 'templates/rootTab/rootTab-mine.html',
          controller: 'MineCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
