angular.module('app.loginControllers',[])

  //link checked
  .controller('LoginCtrl', function($scope,$rootScope,$ionicPopup,$state,$http){

    $scope.login=function(id,password){
      //if (id=="admin"&&password=="admin"){
      //  $ionicPopup.alert({
      //    title: '系统提示',
      //    template: '【后门】登录成功'
      //  });
      //  $rootScope.user_id=id;
      //  $state.go('rootTab.home');
      //}else
      {
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

  //link checked
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

  })

  .controller('PlaceCtrl', function($scope, $http, $ionicPopup) {
    $scope.noResult=false;
    $scope.hasResult=false;
    $scope.loading=false;
    $scope.searchPlace=function() {
      var queryText=$("#place-input").attr("value");
      $scope.noResult=false;
      $scope.hasResult=false;
      $scope.loading=true;
      $http.get("http://localhost:8080/adweb_serviceClient/GetPlaceSuggestion", {params:{
          query : queryText}})
        .success(function(ret) {
          $scope.loading=false;
          $scope.ret=ret;
          if (ret.result.length<1){
            $scope.noResult=true;
            $scope.hasResult=false;
          }else{
            $scope.noResult=false;
            $scope.hasResult=true;

          }
        })
        .error(function(){
          $scope.loading=false;
          $ionicPopup.alert({
            title: '系统提示',
            template: '搜索失败，因网络原因无法搜索'
          });
        });
    };
  })

  .controller('MapCtrl', function($scope, $stateParams, $http, $ionicPopup) {

    var lati,longi,zoom;
    $scope.loading=true;

    var getMap=function(){
      $scope.loading=true;
      $http.get("http://localhost:8080/adweb_serviceClient/GetStaticMap", {params:{
          placeId : "location",
          latitude : $stateParams.latitude,
          longitude : $stateParams.longitude}})
        .success(function(ret) {
          $scope.loading=false;
          if (ret.flag=="1") {
            $scope.realPath = "http://localhost:8080/adweb_serviceClient/staticMap_location.png";
          } else {
            $scope.realPath = "";
            $ionicPopup.alert({
              title: '系统提示',
              template: '因地图服务网络原因无法取得地图'
            });
            $ionicHistory.goBack();
          }
        })
        .error(function(){
          $scope.loading=false;
          $ionicPopup.alert({
            title: '系统提示',
            template: '因网络原因无法取得地图'
          });
          $ionicHistory.goBack();
        });
    };

    //$scope.toNorth=function(){
    //  lati=Number(lati)+0.000003*((30-zoom)*(30-zoom)*(30-zoom));
    //  getMap();
    //};
    //$scope.toSouth=function(){
    //  lati=Number(lati)-0.000003*((30-zoom)*(30-zoom)*(30-zoom));
    //  getMap();
    //};
    //$scope.toWest=function(){
    //  longi=Number(longi)-0.000003*((30-zoom)*(30-zoom)*(30-zoom));
    //  getMap();
    //};
    //$scope.toEast=function(){
    //  longi=Number(longi)+0.000003*((30-zoom)*(30-zoom)*(30-zoom));
    //  getMap();
    //};
    //$scope.toBig=function(){
    //  zoom=Number(zoom)+1;
    //  if (Number(zoom)>16){
    //    zoom=Number(zoom)-1;
    //    $ionicPopup.alert({
    //      title: '系统提示',
    //      template: '无法显示更大地图'
    //    });
    //  }else {
    //    getMap();
    //  }
    //};
    //$scope.toSmall=function(){
    //  zoom=Number(zoom)-1;
    //  if (Number(zoom)<13){
    //    zoom=Number(zoom)+1;
    //    $ionicPopup.alert({
    //      title: '系统提示',
    //      template: '无法显示更小地图'
    //    });
    //  }else {
    //    getMap();
    //  }
    //};

    lati=$stateParams.latitude;
    longi=$stateParams.longitude;
    zoom=$stateParams.zoom;
    getMap();

  });
