angular.module('app.mineControllers',[])

.controller('MineCtrl', function($scope,$rootScope,$ionicPopup,$state,$ionicPopover) {

    $scope.logout=function(){
      $ionicPopup.confirm({
        title: '系统确认',
        template: '退出登录？'
      }).then(function(res) {
        if(res) {
          $rootScope.user_id=null;
          $ionicPopup.alert({
            title: '系统提示',
            template: '已退出登录'
          });
          $state.go('login');
        }
      });
    };

    /*菜单栏的固定格式*/{
      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('templates/pover/pover-navi.html', {
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
