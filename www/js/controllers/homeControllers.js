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

    //搜索功能（待开发）
    $scope.search=function(query){
      if (query==null||query==""){

        $ionicPopup.alert({
          title: '系统提示',
          template: '搜索词不能为空'
        });

      }else{

        $ionicPopup.alert({
          title: '搜索词',
          template: query
        });

      }
    };

    //图层变换功能（待开发）
    $scope.layer=function(item){

      $ionicPopup.alert({
        title: '图层改变',
        template: item.text+item.checked
      });

    };

    //显示景观地点的函数
    var showSight=function(map){
      var i;
      for (i=0;i<$scope.sightList.length;i++){
        var s=$scope.sightList[i];
        new AMap.Marker({
          map: map,
          icon: "img/mark_b.png",
          position: [s.sight_longi, s.sight_lati],
          offset: new AMap.Pixel(-12, -36)
        });
      }
    };

    //加载地图
    //调用浏览器定位服务
    //显示所有景观地点
    // 的函数，加载用户数据成功后再加载地图
    $scope.loading=true;//默认状态：地图未加载
    var loadMap=function() {
      $rootScope.lati=31.245554;//定位失败时默认位置：东方明珠
      $rootScope.longi=121.506191;
      var map, toolBar, geolocation;
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
        });
        //定位失败
        AMap.event.addListener(geolocation, 'error', function(data) {
          $scope.loading=false;
          $ionicPopup.alert({
            title: '系统提示',
            template: '定位失败，显示默认位置'
          });
          showSight(map);
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
