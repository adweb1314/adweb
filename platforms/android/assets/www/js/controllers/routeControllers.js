angular.module('app.routeControllers',[])

  .controller('RouteCtrl', function($scope,$rootScope,$ionicPopup,$ionicPopover) {

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

    //取得数据
    $scope.sightList=$rootScope.sightList;
    $scope.sightTypeList=$rootScope.sightTypeList;

    /*标识点相关函数*/
    //点击标识弹出信息框的控制变量
    //单击标识事件的设置
    //内容生成函数
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    function markerClick(e) {
      infoWindow.setContent(e.target.content);
      infoWindow.open(map, e.target.getPosition());
    }
    function infoCreater(s){
      var i,t;
      for (i=0;i<$scope.sightTypeList.length;i++) {
        t = $scope.sightTypeList[i];
        if (t.sight_type_id==s.sight_type_id){
          break;
        }
      }
      return(
        "<div>" +
        " <span class='my-text-big'>"+ s.sight_name+"</span>" +
        " <span class='my-text-small'>["+ t.sight_type_name+"]</span>" +
        "</div>" +
        "<div>" +
        " <div class='my-text-small'>&nbsp&nbsp&nbsp&nbsp"+ s.sight_description.substring(0,15) +"</div>" +
        " <div class='my-text-small'>"+ s.sight_description.substring(15,30) +"...</div>" +
        "</div>" +
        "<div class='text-center my-top-margin'>" +
        " <a class='button button-positive my-button-small' href='#/rootTab/sight/"+s.sight_name+"'>进入景观页面</a>" +
        "</div>"
      );
    }

    //用来初始化地图，显示所有景观地点标识的函数
    var showSight=function(map){
      var i;
      markers=[];
      for (i=0;i<$scope.sightList.length;i++){
        var s=$scope.sightList[i];
        var marker = new AMap.Marker({
          map: map,
          icon: "http://localhost:8080/img/my_mark_"+s.sight_type_id+".png",
          position: [s.sight_longi, s.sight_lati]
        });
        markers.push(marker);
        marker.content=infoCreater(s);
        marker.on('click',markerClick);
        marker.emit('click',{target:marker});
      }
      marker = new AMap.Marker({
        map: map,
        icon: "http://localhost:8080/img/my_mark_self.png",
        position: [$rootScope.longi, $rootScope.lati]
      });
      selfMarker=marker;
      marker.content = '<p>当前位置</p>';
      marker.on('click', markerClick);
      marker.emit('click', {target: marker});
    };

    //额外显示某类地点标识的函数
    var addSight=function(map,id){
      var i;
      for (i=0;i<$scope.sightList.length;i++){
        var s=$scope.sightList[i];
        if (id==s.sight_type_id){
          markers[i] = new AMap.Marker({
            map: map,
            icon: "http://localhost:8080/img/my_mark_"+s.sight_type_id+".png",
            position: [s.sight_longi, s.sight_lati]
          });
          var marker=markers[i];
          marker.content=infoCreater(s);
          marker.on('click',markerClick);
          marker.emit('click',{target:marker});
        }
      }
    };

    //去掉显示某类地点标识的函数
    var removeSight=function(map,id){
      var i;
      for (i=0;i<$scope.sightList.length;i++){
        var s=$scope.sightList[i];
        if (id==s.sight_type_id){
          markers[i].setMap(null);
        }
      }
    };

    //从所有已选图层中筛选query命中的地点标识的函数
    var querySight=function(map,query){
      var i;
      //全部删除，然后添加可能需要的
      for (i=0;i<$scope.devList.length;i++) {
        var dev=$scope.devList[i];
        removeSight(map,dev.id);
        if (dev.checked){
          addSight(map,dev.id);
        }
      }
      //继续在可能需要的中删除不匹配项
      for (i=0;i<$scope.sightList.length;i++){
        var s=$scope.sightList[i];
        if (s.sight_name.indexOf(query)<0){
          markers[i].setMap(null);
        }
      }
      selfMarker.setMap(null);
      selfMarker = new AMap.Marker({
        map: map,
        icon: "http://localhost:8080/img/my_mark_self.png",
        position: [$rootScope.longi, $rootScope.lati]
      });
      var marker=selfMarker;
      marker.content='<p>当前位置</p>';
      marker.on('click',markerClick);
      marker.emit('click',{target:marker});
      map.setFitView();
    };

    //事件：切换图层以致可能额外显示一些地点标识时
    var addSightEvent=function(map,id){
      if ($scope.lastQuery==null){
        $scope.lastQuery="";
      }
      querySight(map,$scope.lastQuery);
    };

    //事件：切换图层以致可能去掉显示一些地点标识时
    var removeSightEvent=function(map,id){
      if ($scope.lastQuery==null){
        $scope.lastQuery="";
      }
      querySight(map,$scope.lastQuery);
    };

    //构造图层选择框
    var i;
    var devList=[];
    for (i=0;i<$scope.sightTypeList.length;i++){
      var s=$scope.sightTypeList[i];
      var dev={
        index: i,
        id: s.sight_type_id,
        text: s.sight_type_name,
        checked: true
      };
      devList.push(dev);
    }
    $scope.devList=devList;

    //显示所有景观类别
    showSight(map);

    //图层变换功能
    $scope.layer=function(item){
      if (item.checked){
        addSightEvent(map,item.id);
      }else{
        removeSightEvent(map,item.id);
      }
    };

    //根据起终点坐标规划步行路线的函数
    var walking=function(start,dest){
      //目的地为空
      if (dest.name==""){
        $ionicPopup.alert({
          title: '系统提示',
          template: '目的地不能为空，请输入目的地'
        });
        return;
      }
      //初始化
      var walking = new AMap.Walking({
        map: map
      });
      var geocoder = new AMap.Geocoder();
      //判断
      if (start.name==""){
        //出发地为空
        start.longi=$rootScope.longi;
        start.lati=$rootScope.lati;
        geocoder.getLocation(dest.name, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            dest.longi=result.geocodes[0].location.getLng();
            dest.lati=result.geocodes[0].location.getLat();
            map.clearMap();
            showSight(map);
            walking.search([start.longi,start.lati], [dest.longi,dest.lati]);
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '未找到目的地，请重新输入'
            });
          }
        });
      }else{
        //出发地非空
        geocoder.getLocation(start.name, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            start.longi=result.geocodes[0].location.getLng();
            start.lati=result.geocodes[0].location.getLat();
            geocoder.getLocation(dest.name, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                dest.longi=result.geocodes[0].location.getLng();
                dest.lati=result.geocodes[0].location.getLat();
                map.clearMap();
                showSight(map);
                walking.search([start.longi,start.lati], [dest.longi,dest.lati]);
              }else{
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '未找到目的地，请重新输入'
                });
              }
            });
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '未找到出发点，请重新输入'
            });
          }
        });
      }
    };

    //进行路径规划的函数
    $scope.goRoute=function() {
      walking($scope.start,$scope.dest);
    };

    //初始出发地初始为空
    $scope.start={
      name:"",
      lati:$rootScope.lati,
      longi:$rootScope.longi
    };

    //初始化目的地，若设定过目的地，则直接进行一次寻路
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
