angular.module('app.loginControllers',[])

.controller('LoginCtrl', function($scope,$rootScope,$ionicPopup,$state,$http){

  $scope.login=function(id,password){
    if (id=="admin"&&password=="admin"){
      $ionicPopup.alert({
        title: '系统提示',
        template: '【后门】登录成功'
      });
      $rootScope.user_id=id;
      $state.go('rootTab.home');
    }else{
      $http.get("http://localhost:8080/login/"+id+"/"+password)
        .success(function(ret){
          if (ret.flag==1) {
            $ionicPopup.alert({
              title: '系统提示',
              template: '登录成功'
            });
            $rootScope.user_id=id;
            $state.go('rootTab.home');
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '登录失败，ID与密码不匹配'
            });
          }
        })
        .error(function(){
          $ionicPopup.alert({
            title: '系统提示',
            template: '登录失败，无法连接到服务器'
          });
        });
    }
  };

})

.controller('RegisterCtrl', function($scope,$rootScope,$ionicPopup,$state,$http){

  $scope.register=function(id,password){
    $http.get("http://localhost:8080/register/"+id+"/"+password)
      .success(function(ret){
        if (ret.flag==1) {
          $ionicPopup.alert({
            title: '系统提示',
            template: '注册成功，已自动登录'
          });
          $rootScope.user_id=id;
          $state.go('rootTab.home');
        }else{
          $ionicPopup.alert({
            title: '系统提示',
            template: '注册失败，ID已被占用'
          });
        }
      })
      .error(function(){
        $ionicPopup.alert({
          title: '系统提示',
          template: '注册失败，无法连接到服务器'
        });
      });
  };

});
