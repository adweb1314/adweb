angular.module('app.routeControllers',[])

  .controller('RouteCtrl', function($scope,$rootScope,$ionicPopover) {

    $scope.dest_name=$rootScope.dest_name;
    $scope.dest_lati=$rootScope.dest_lati;
    $scope.dest_longi=$rootScope.dest_longi;

    /*菜单栏的固定格式*/{
      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('templates/pover/pover-sightList.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      // 清除浮动框
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
    }

  });
