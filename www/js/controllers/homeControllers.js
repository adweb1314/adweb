angular.module('app.homeControllers',[/*'baiduMap'*/])

  .controller('HomeCtrl', function($scope,$ionicPopup,$ionicPopover,$http) {

    //详细信息展开与收回
    $scope.expand=false;
    $scope.doExpand=function(){
      $scope.expand=true;
    };
    $scope.cancelExpand=function(){
      $scope.expand=false;
    };

    //搜索功能
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

    //图层变换功能
    $scope.layer=function(item){
      $ionicPopup.alert({
        title: '图层改变',
        template: item.text+item.checked
      });
    };

    //获取当前位置

    //绘制基本地图
    var map = new AMap.Map('container', {
      resizeEnable: true,
      zoom:12,
      center: [121.506191, 31.245554]
    });
    var toolBar = new AMap.ToolBar();
    map.addControl(toolBar);

    //取得地点数据
    $http.get("http://localhost:8080/sight")
      .success(function(ret){
        $scope.sightList=ret;
      })
      .error(function(){
        $ionicPopup.alert({
          title: '系统提示',
          template: '获取景观数据失败，无法连接到服务器'
        });
      });

    //取得类型数据
    $http.get("http://localhost:8080/sight_type")
      .success(function(ret){
        $scope.sightTypeList=ret;
      })
      .error(function(){
        $ionicPopup.alert({
          title: '系统提示',
          template: '获取类别数据失败，无法连接到服务器'
        });
      });
    $scope.devList = [
      { text: "0", checked: true },
      { text: "1", checked: true },
      { text: "2", checked: true }
    ];

    /*菜单栏的固定格式*/
    {
      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('templates/pover/pover-navi.html', {
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
