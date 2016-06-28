angular.module('app.sightValueControllers',[])

  //所有评论页面控制
  .controller('SightCommentCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$http) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;
    $scope.user_id=$rootScope.user_id;

    //获取评论数据
    var getAllComments=function(){
      $http.get("http://localhost:8080/comment/"+$scope.sight_name)
        .success(function(ret){
          var i,tempList=[];
          for (i=ret.length-1;i>=0;i--){
            tempList.push(ret[i]);
          }
          $scope.sightCommentList=tempList;
        });
    };
    getAllComments();

    //删除评论按钮
    $scope.deleteComment=function(id){
      $http.get("http://localhost:8080/comment/delete/"+id).success(function(ret){
        if (ret.flag==1){
          getAllComments();
          $ionicPopup.alert({
            title: '系统提示',
            template: '评论删除成功'
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

  //评价信息页面控制
  .controller('SightValueCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$http) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;

    //获取景观数据
    $scope.sightList=$rootScope.sightList;
    var i;
    for (i=0;i<$scope.sightList.length;i++){
      if ($scope.sightList[i].sight_name==$scope.sight_name){
        $scope.sight=$scope.sightList[i];
        break;
      }
    }

    //绘制景观地图，得到折线数据并绘制折线
    var map;
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: $scope.sight.sight_zoom,
      center: [$scope.sight.sight_longi, $scope.sight.sight_lati]
    });
    if ($rootScope.lineName==null||$rootScope.lineName!=$scope.sight_name) {
      $http.get("http://localhost:8080/line/"+$scope.sight_name).success(function(ret){
        $rootScope.lineName=$scope.sight_name;
        var i,line=[];
        for (i=0;i<ret.length;i++){
          var l=[ret[i].line_longi, ret[i].line_lati];
          line.push(l);
        }
        line.push([ret[0].line_longi, ret[0].line_lati]);
        $rootScope.line=line;
        var polyline = new AMap.Polyline({
          path: line,          //设置线覆盖物路径
          strokeColor: "#3366FF", //线颜色
          strokeOpacity: 1,       //线透明度
          strokeWeight: 2,        //线宽
          strokeStyle: "solid",   //线样式
          strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(map);
      })
    }else{
      var line=$rootScope.line;
      var polyline = new AMap.Polyline({
        path: line,          //设置线覆盖物路径
        strokeColor: "#3366FF", //线颜色
        strokeOpacity: 1,       //线透明度
        strokeWeight: 2,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [10, 5] //补充线样式
      });
      polyline.setMap(map);
    }

    //得到value数据并标记value
    if ($rootScope.valueName==null||$rootScope.valueName!=$scope.sight_name) {
      $http.get("http://localhost:8080/value/"+$scope.sight_name).success(function(ret){
        $rootScope.valueName=$scope.sight_name;
        $rootScope.value=ret;
        $scope.value=ret;
        //画地图标识

      })
    }else{
      $scope.value=$rootScope.value;
      //画地图标识

    }

    ///*菜单栏的固定格式*/{
    //  // .fromTemplateUrl() 方法
    //  $ionicPopover.fromTemplateUrl('templates/pover/pover-sightList.html', {
    //    scope: $scope
    //  }).then(function(popover) {
    //    $scope.popover = popover;
    //  });
    //  $scope.openPopover = function($event) {
    //    $scope.popover.show($event);
    //  };
    //  $scope.closePopover = function() {
    //    $scope.popover.hide();
    //  };
    //  // 清除浮动框
    //  $scope.$on('$destroy', function() {
    //    $scope.popover.remove();
    //  });
    //}

  });
