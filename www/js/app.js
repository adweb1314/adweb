angular.module('app', ['ionic',
  'app.loginControllers',
  'app.homeControllers',
  'app.sightListControllers',
  'app.sightDetailControllers',
  'app.sightValueControllers',
  'app.nearbyControllers',
  'app.historyControllers',
  'app.routeControllers',
  'app.mineControllers'
  ])

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
      //cache: 'false',
      templateUrl:'templates/login/login.html',
      controller: 'LoginCtrl'
    })
    .state('register', {
      url:'/register',
      cache: 'false',
      templateUrl:'templates/login/register.html',
      controller:'RegisterCtrl'
    })

    .state('rootTab', {
      url: '/rootTab',
      abstract: true,
      templateUrl: 'templates/rootTab/rootTab.html',
    })
    .state('rootTab.home', {
      url: '/home',
      cache: 'false',
      views: {
        'rootTab-home': {
          templateUrl: 'templates/rootTab/rootTab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('rootTab.sightList', {
      url: '/sightList',
      //cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/rootTab/rootTab-sightList.html',
          controller: 'SightListCtrl'
        }
      }
    })
    .state('rootTab.sight', {
      url: '/sight/:sight_name',
      cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/sightList/sightList-sight.html',
          controller: 'SightCtrl'
        }
      }
    })
    .state('rootTab.sight-detail', {
      url: '/sight-detail/:sight_name',
      //cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/sightList/sight-detail.html',
          controller: 'SightDetailCtrl'
        }
      }
    })
    .state('rootTab.sight-comment', {
      url: '/sight-comment/:sight_name',
      cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/sightList/sight-comment.html',
          controller: 'SightCommentCtrl'
        }
      }
    })
    .state('rootTab.sight-value', {
      url: '/sight-value/:sight_name',
      cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/sightList/sight-value.html',
          controller: 'SightValueCtrl'
        }
      }
    })
    .state('rootTab.sight-survey', {
      url: '/sight-survey/:sight_name',
      cache: 'false',
      views: {
        'rootTab-sightList': {
          templateUrl: 'templates/sightList/sight-survey.html',
          controller: 'SightSurveyCtrl'
        }
      }
    })
    .state('rootTab.nearby', {
      url: '/nearby',
      cache: 'false',
      views: {
        'rootTab-nearby': {
          templateUrl: 'templates/rootTab/rootTab-nearby.html',
          controller: 'NearbyCtrl'
        }
      }
    })
    .state('rootTab.history', {
      url: '/history',
      cache: 'false',
      views: {
        'rootTab-history': {
          templateUrl: 'templates/rootTab/rootTab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })
    .state('rootTab.route', {
      url: '/route',
      cache: 'false',
      views: {
        'rootTab-route': {
          templateUrl: 'templates/rootTab/rootTab-route.html',
          controller: 'RouteCtrl'
        }
      }
    })
    .state('rootTab.mine', {
      url: '/mine',
      cache: 'false',
      views: {
        'rootTab-mine': {
          templateUrl: 'templates/rootTab/rootTab-mine.html',
          controller: 'MineCtrl'
        }
      }
    })
    .state('rootTab.mine-changeInfo', {
    url: '/mine/changeInfo',
    cache: 'false',
    views: {
      'rootTab-mine': {
        templateUrl: 'templates/mine/mine-changeInfo.html',
        controller: 'ChangeInfoCtrl'
      }
    }
  })
    .state('rootTab.mine-changePw', {
      url: '/mine/changePw',
      cache: 'false',
      views: {
        'rootTab-mine': {
          templateUrl: 'templates/mine/mine-changePw.html',
          controller: 'ChangePwCtrl'
        }
      }
    })
    .state('rootTab.mine-share', {
      url: '/mine/share',
      cache: 'false',
      views: {
        'rootTab-mine': {
          templateUrl: 'templates/mine/mine-share.html',
          controller: 'ShareCtrl'
        }
      }
    })
    .state('rootTab.mine-collection', {
      url: '/mine/collection',
      cache: 'false',
      views: {
        'rootTab-mine': {
          templateUrl: 'templates/mine/mine-collection.html',
          controller: 'CollectionCtrl'
        }
      }
    })
    .state('place', {
      url: '/place',
      //cache:'false',
      templateUrl: 'templates/login/place.html',
      controller: 'PlaceCtrl'
    })
    .state('map', {
      url: '/map/:latitude/:longitude/:tempId',
      cache:'false',
      templateUrl: 'templates/login/map.html',
      controller: 'MapCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
