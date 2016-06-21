angular.module('app.loginControllers',[])

.controller('LoginCtrl', function($scope,$ionicPopup,$state,$http){

  $scope.login=function(id,password){
    $http.get("http://localhost:8080/login/"+id+"/"+password)
      .success(function(ret){
        if (ret.flag==1) {
          $ionicPopup.alert({
            title: '系统提示',
            template: '登录成功'
          });
          $state.go('rootTab.sightList');
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

})

.controller('RegisterCtrl', function($scope){

});
