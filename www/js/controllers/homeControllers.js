angular.module('app.homeControllers',[])

  .controller('HomeCtrl', function($scope,$rootScope,$ionicPopup,$ionicPopover,$state,$http) {

    //详细信息展开与收回
    $scope.expand=false;
    $scope.doExpand=function(){
      $scope.expand=true;
    };
    $scope.cancelExpand=function(){
      $scope.expand=false;
    };

    //点击标识弹出信息框的控制变量
    //单击标识事件的设置
    //内容生成函数
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    function markerClick(e) {
      infoWindow.setContent(e.target.content);
      infoWindow.open(map, e.target.getPosition());
    }
    function infoCreater(sight_name){
      return("<a href=\"#/rootTab/sight/"+sight_name+"\">"+sight_name+"</a>");
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
        marker.content=infoCreater(s.sight_name);
        marker.on('click',markerClick);
        marker.emit('click',{target:marker});
      }
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
          marker.content=infoCreater(s.sight_name);
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

    //加载地图
    //调用浏览器定位服务
    //显示所有景观地点
    // 的函数，加载用户数据成功后再加载地图
    $scope.loading=true;//默认状态：地图未加载
    var loadMap=function() {
      $rootScope.lati=31.245554;//定位失败时默认位置：东方明珠
      $rootScope.longi=121.506191;
      var toolBar, geolocation;

      map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:13,
        center: [$rootScope.longi, $rootScope.lati]
      });
      toolBar = new AMap.ToolBar();
      map.addControl(toolBar);
      map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 2000,          //超过2秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB'
        });
        //map.addControl(geolocation);
        geolocation.getCurrentPosition();
        //定位成功
        AMap.event.addListener(geolocation, 'complete', function(data) {
          $scope.loading=false;
          $ionicPopup.alert({
            title: '系统提示',
            template: '定位成功,如有偏差请以实际位置为准'
          });
          $rootScope.lati=data.position.getLat();
          $rootScope.longi=data.position.getLng();
          map = new AMap.Map('container', {
            resizeEnable: true,
            zoom:13,
            center: [data.position.getLng(), data.position.getLat()]
          });
          toolBar = new AMap.ToolBar();
          map.addControl(toolBar);
          showSight(map);
          selfMarker = new AMap.Marker({
            map: map,
            icon: "http://localhost:8080/img/my_mark_self.png",
            position: [$rootScope.longi, $rootScope.lati]
          });
          selfMarker.content = '我的位置';
          selfMarker.on('click', markerClick);
          selfMarker.emit('click', {target: marker});
        });
        //定位失败
        AMap.event.addListener(geolocation, 'error', function(data) {
          $scope.loading=false;
          $ionicPopup.alert({
            title: '系统提示',
            template: '定位失败，显示默认位置'
          });
          showSight(map);
          selfMarker = new AMap.Marker({
            map: map,
            icon: "http://localhost:8080/img/my_mark_self.png",
            position: [$rootScope.longi, $rootScope.lati]
          });
          selfMarker.content = '我的位置';
          selfMarker.on('click', markerClick);
          selfMarker.emit('click', {target: marker});
        });
      });
    };

    //取得地点数据
    // 取得类型数据
    //  构造图层选择框
    //  载入地图
    $http.get("http://localhost:8080/sight")
      .success(function(ret){
        $scope.sightList=ret;
        $rootScope.sightList=ret;
        $http.get("http://localhost:8080/sight_type")
          .success(function(ret){
            $scope.sightTypeList=ret;
            $rootScope.sightTypeList=ret;
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
            loadMap();
          });
      })
      .error(function(){
        $ionicPopup.alert({
          title: '系统提示',
          template: '由于网络问题无法连接到服务器'
        });
        $state.go('login');
      });

    //搜索功能
    //将搜索词加入到后台历史记录功能
    $scope.search=function(query){
      if (query==null) {
        query="";
      }
      $scope.lastQuery=query;
      querySight(map,query);
    };

    //图层变换功能
    $scope.layer=function(item){
      if (item.checked){
        addSightEvent(map,item.id);
      }else{
        removeSightEvent(map,item.id);
      }
    };

    /*菜单栏的固定格式*/
    {
      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('templates/pover/pover-sightList.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function () {
        $scope.popover.hide();
      };
      // 清除浮动框
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });
    }

    /*百度地图
    {
      $scope.offlineOpts = {
        retryInterval: 10000,
        txt: 'Offline Mode'
      };
      var longitude = 121.506191;
      var latitude = 31.245554;
      $scope.mapOptions = {
        center: {
          longitude: longitude,
          latitude: latitude
        },
        zoom: 13,
        city: 'ShangHai',
        markers: [{
          longitude: longitude,
          latitude: latitude,
          icon: 'img/mappiont.png',
          width: 49,
          height: 60,
          title: 'Where',
          content: "www.baidu.com"
        }]
      };

      $scope.loadMap = function(map) {
        console.log(map);//gets called while map instance created
      };
    }*/

  });
