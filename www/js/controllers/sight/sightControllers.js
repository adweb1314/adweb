angular.module('app.sightControllers',[])

  //单个景观页面控制
  .controller('SightCtrl', function($scope,$rootScope,$stateParams,$ionicHistory,$ionicPopover,$ionicPopup,$http) {

    //url参数传递
    $scope.sight_name=$stateParams.sight_name;

    //回退时禁止回退
    $scope.doBack=function(){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    };

    //前进时允许回退
    $scope.doForward=function(){
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
    };

    //详细信息展开与收回
    $scope.expand=false;
    $scope.expand2=false;
    $scope.doExpand=function(){
      $scope.expand=true;
    };
    $scope.cancelExpand=function(){
      $scope.expand=false;
    };
    $scope.doExpand2=function(){
      $scope.expand2=true;
    };
    $scope.cancelExpand2=function(){
      $scope.expand2=false;
    };

    //滑动框默认格式
    $scope.myActiveSlide = 1;

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
    if ($rootScope.lineName==null||$rootScope.lineName!=$scope.sight_name){
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

    //获取用户收藏、足迹、心愿数据
    $http.get("http://localhost:8080/collection/"+$rootScope.user_id+"/"+$scope.sight_name)
      .success(function(ret){
        $scope.isCollection=ret.flag;
        $http.get("http://localhost:8080/step/"+$rootScope.user_id+"/"+$scope.sight_name)
          .success(function(ret){
            $scope.isStep=ret.flag;
            $http.get("http://localhost:8080/wish/"+$rootScope.user_id+"/"+$scope.sight_name)
              .success(function(ret){
                $scope.isWish=ret.flag;
              });
          });
      });

    //toggle用户收藏、足迹、心愿数据的函数
    $scope.toggleCollection=function(){
      $http.get("http://localhost:8080/collection/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isCollection=ret.flag;
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
    $scope.toggleStep=function(){
      $http.get("http://localhost:8080/step/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isStep=ret.flag;
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
    $scope.toggleWish=function(){
      $http.get("http://localhost:8080/wish/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isWish=ret.flag;
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

    //获取评论数据
    var getAllComment=function(){
      $http.get("http://localhost:8080/comment/"+$scope.sight_name)
        .success(function(ret){
          var i,tempList=[];
          for (i=ret.length-1;i>=0&&i>=ret.length-5;i--){
            tempList.push(ret[i]);
          }
          $scope.sightCommentList=tempList;
          $scope.cancelExpand2();
        });
    };
    getAllComment();

    //选择路径导航时
    $scope.goRoute=function(){
      $scope.doForward();
      $rootScope.dest={
        name:$scope.sight.sight_name,
        lati:$scope.sight.sight_lati,
        longi:$scope.sight.sight_longi};
    };

    //新建评论功能
    $scope.addComment=function(grade,comment){
      $http.get("http://localhost:8080/comment/"
        +$rootScope.user_id+"/"+$scope.sight_name+"/"+grade+"/"+comment).success(function(ret){
        if (ret.flag==1){
          getAllComment();
          $ionicPopup.alert({
            title: '系统提示',
            template: '评论成功'
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

  //详细资料页面控制
  .controller('SightDetailCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$http) {

    //url参数传递
    $scope.sight_name=$stateParams.sight_name;

    //获取景观数据
    $scope.sightList=$rootScope.sightList;
    var i;
    for (i=0;i<$scope.sightList.length;i++){
      if ($scope.sightList[i].sight_name==$scope.sight_name){
        $scope.sight=$scope.sightList[i];
        break;
      }
    }

    //获取用户收藏、足迹、心愿数据
    $http.get("http://localhost:8080/collection/"+$rootScope.user_id+"/"+$scope.sight_name)
      .success(function(ret){
        $scope.isCollection=ret.flag;
        $http.get("http://localhost:8080/step/"+$rootScope.user_id+"/"+$scope.sight_name)
          .success(function(ret){
            $scope.isStep=ret.flag;
            $http.get("http://localhost:8080/wish/"+$rootScope.user_id+"/"+$scope.sight_name)
              .success(function(ret){
                $scope.isWish=ret.flag;
              });
          });
      });

    //toggle用户收藏、足迹、心愿数据的函数
    $scope.toggleCollection=function(){
      $http.get("http://localhost:8080/collection/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isCollection=ret.flag;
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
    $scope.toggleStep=function(){
      $http.get("http://localhost:8080/step/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isStep=ret.flag;
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
    $scope.toggleWish=function(){
      $http.get("http://localhost:8080/wish/toggle/"+$rootScope.user_id+"/"+$scope.sight_name)
        .success(function(ret){
          $scope.isWish=ret.flag;
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

    //报错
    $scope.baocuo=function(){
      $ionicPopup.show({
        template: '<input type="text" ng-model="info">',
        title: '请输入报错信息',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>发送</b>',
            type: 'button-positive',
            onTap: function(e) {
              $ionicPopup.alert({
                title: '系统提示',
                template: '报错提交成功'
              });
            }
          }
        ]
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

  });
