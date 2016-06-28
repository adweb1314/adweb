angular.module('app.routeControllers',[])

  .controller('RouteCtrl', function($scope,$rootScope,$ionicPopover) {

    //详细信息展开与收回
    $scope.expand=false;
    $scope.doExpand=function(){
      $scope.expand=true;
    };
    $scope.cancelExpand=function(){
      $scope.expand=false;
    };

    //根据首页定位信息初始化地图
    var map, toolBar;
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom:13,
      center: [$rootScope.longi, $rootScope.lati]
    });
    toolBar = new AMap.ToolBar();
    map.addControl(toolBar);
    //根据起终点坐标规划步行路线的函数
    var walking=function(start,dest){
      var walking = new AMap.Walking({
        map: map
      });
      walking.search([start.longi,start.lati], [dest.longi,dest.lati]);
    };
    //进行路径规划的函数
    $scope.goRoute=function() {
      walking($scope.start,$scope.dest);
    };

    //初始出发地为空，任何时候出发地点为空就从首页定位的用户所在地出发
    $scope.start={
      name:"",
      lati:$rootScope.lati,
      longi:$rootScope.longi
    };

    //判断有没有设定过目的地，若设定过，则直接进行一次寻路
    if ($rootScope.dest==null||$rootScope.dest.name==null||$rootScope.dest.name==""){
      $rootScope.dest={
        name:"",
        lati:"",
        longi:""};
    }else{
      $scope.dest=$rootScope.dest;
      $scope.goRoute();
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

  });
