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
    $scope.collection=function(){
      $state.go('rootTab.mine-collection');
    };
    $scope.share=function(){
      $state.go('rootTab.mine-share');
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

  })
  .controller('CollectionCtrl', function($scope,$rootScope,$ionicPopup,$state,$ionicPopover,$http) {

    //前进时允许回退
    $scope.doForward=function(){
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
    };

    //获取用户数据
    $scope.sightList=$rootScope.sightList;
    $scope.sightTypeList=$rootScope.sightTypeList;

    $scope.isCollection = new Object();
    $scope.isStep = new Object();
    $scope.isWish = new Object();
    $scope.sightListNew = [];

    var getOneDate=function(s){
      var sight_name = s.sight_name;
      $http.get("http://localhost:8080/collection/" + $rootScope.user_id + "/" + sight_name).success(function(ret)
      {
        var isCollection = ret.flag;
        $http.get("http://localhost:8080/step/" + $rootScope.user_id + "/" + sight_name).success(function(ret){
          var isStep = ret.flag;
          $http.get("http://localhost:8080/wish/" + $rootScope.user_id + "/" + sight_name).success(function(ret){
            var isWish = ret.flag;
              $scope.sightListNew.push({
                sight_name: s.sight_name,
                sight_description: s.sight_description,
                sight_type_id: s.sight_type_id,
                sight_lati: s.sight_lati,
                sight_longi: s.sight_longi,
                sight_zoom: s.sight_zoom,
                sight_detail: s.sight_detail,
                isCollection: isCollection,
                isStep: isStep,
                isWish: isWish
              });
          });
        });
      })
      .error(function()
      {alert("error"+sight_name)});
    };


    //获取用户收藏、足迹、心愿数据
    var length = $scope.sightList.length;
    for(var i = 0; i < length; i++) {
      var sight_name = $scope.sightList[i].sight_name;
      getOneDate($scope.sightList[i] );
    }
    //toggle用户收藏、足迹、心愿数据的函数
    $scope.toggleCollection=function(s){
      var sight = s.sight_name;
      $http.get("http://localhost:8080/collection/toggle/"+$rootScope.user_id+"/"+sight)
        .success(function(ret){
          s.isCollection = ret.flag;
          if (ret.flag==1){
            $ionicPopup.alert({
              title: '系统提示',
              template: '已加入收藏'
            });
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '已取消收藏'
            });
          }
        })
    };
    $scope.toggleStep=function(s){
      var sight = s.sight_name;
      $http.get("http://localhost:8080/step/toggle/"+$rootScope.user_id+"/"+sight)
        .success(function(ret){
          s.isStep = ret.flag;
          if (ret.flag==1){
            $ionicPopup.alert({
              title: '系统提示',
              template: '已加入足迹'
            });
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '已取消足迹'
            });
          }
        })
    };
    $scope.toggleWish=function(s){
      var sight = s.sight_name;
      $http.get("http://localhost:8080/wish/toggle/"+$rootScope.user_id+"/"+sight)
        .success(function(ret){
          s.isWish = ret.flag;
          if (ret.flag==1){
            $ionicPopup.alert({
              title: '系统提示',
              template: '已加入心愿'
            });
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '已取消心愿'
            });
          }
        })
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
.controller('ShareCtrl', function($scope,$rootScope,$ionicPopup,$state,$ionicPopover,$http) {
    $scope.sightList = $rootScope.sightList;
    $scope.shareTypeList = [{name:"我发出的分享", id:0}, {name:"我收到的分享", id:1}];
    $http.get("http://localhost:8080/share/"+$rootScope.user_id)
        .success(function(ret){
          $scope.shareList = ret;
     });
    $http.get("http://localhost:8080/share/tome/"+$rootScope.user_id)
    .success(function(ret){
      for (var i = 0; i < ret.length; i++) {
        $scope.shareList.push(ret[i]);
      }
    });
    $scope.user_id = $rootScope.user_id;
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
