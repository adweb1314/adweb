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
    $scope.changeInfo=function(){
          $state.go('rootTab.mine-changeInfo');
    };
    $scope.changePw=function(){
      $state.go('rootTab.mine-changePw');
    };

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

  })
  .controller('ChangeInfoCtrl', function($scope,$rootScope,$ionicPopup,$state,$ionicPopover,$http) {

    $scope.changeInfo=function(user_name,user_avatar){
      $http.get("http://localhost:8080/user/updateNameAndPic/"+$rootScope.user_id+"/"+user_name+"/"+user_avatar)
        .success(function(ret){
          if(ret.flag === 1)
          {
            $ionicPopup.alert({
              title: '系统提示',
              template: '修改成功'
            });
            $state.go("rootTab.mine");
          }
          else
          {
            $ionicPopup.alert({
              title: '系统提示',
              template: '修改失败'
            });
            $state.go("rootTab.mine");
          }
        })
        .error(function(){
          $ionicPopup.alert({
            title: '系统提示',
            template: '操作失败，无法连接到服务器'
          });
          $state.go("rootTab.mine");
        });
    }

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

  })
  .controller('ChangePwCtrl', function($scope,$rootScope,$ionicPopup,$state,$ionicPopover,$http) {

    $scope.changePw=function(oldPw, newPw){
      var pwCorrect = 0; // 旧密码是否正确
      $http.get("http://localhost:8080/login/"+$rootScope.user_id+"/"+oldPw)
        .success(function(ret){
          if(ret.flag === 1)
          {
            $http.get("http://localhost:8080/user/updatePassword/"+$rootScope.user_id+"/"+newPw)
              .success(function(ret){
                if(ret.flag === 1)
                {
                  $ionicPopup.alert({
                    title: '系统提示',
                    template: '修改密码成功'
                  });
                  $state.go("rootTab.mine");
                }
                else
                {
                  $ionicPopup.alert({
                    title: '系统提示',
                    template: '修改密码失败'
                  });
                  $state.go("rootTab.mine");
                }
              })
              .error(function(){
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '操作失败，无法连接到服务器'
                });
                $state.go("rootTab.mine");
              });
          }
          else
            $ionicPopup.alert({
              title: '系统提示',
              template: '修改失败，旧密码不正确'
            });
        })
        .error(function(){
        $ionicPopup.alert({
          title: '系统提示',
          template: '操作失败，无法连接到服务器'
        });
      });

    };

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
