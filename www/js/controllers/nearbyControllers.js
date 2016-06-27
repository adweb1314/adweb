angular.module('app.nearbyControllers', [])

  .controller('NearbyCtrl', function($scope,$rootScope,$ionicPopup,$ionicPopover,$state,$http) {

    //前进时禁止回退
    $scope.doForward=function(){
      $ionicHistory.nextViewOptions({
        disableBack: true
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
      //map.setFitView();
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

    //初始化地图，设置视角限制，取得视角数据
    var map = new AMap.Map('container', {
      resizeEnable: false,
      zoom:13,
      center: [$rootScope.longi, $rootScope.lati]
    });
    map.setLimitBounds(map.getBounds());
    var limitBounds = map.getLimitBounds();
    var longi1=limitBounds.southwest.lng;
    var lati1=limitBounds.southwest.lat;
    var longi2=limitBounds.northeast.lng;
    var lati2=limitBounds.northeast.lat;

    //取得地点数据、类型数据、视角内地点数据
    $scope.sightTypeList=$rootScope.sightTypeList;
    if ($rootScope.sightListIn==null){
      $scope.sightList=$rootScope.sightList;
      var sightList=[];
      for (i=0;i<$rootScope.sightList.length;i++){
        var s=$rootScope.sightList[i];
        var longi=s.sight_longi;
        var lati=s.sight_lati;
        if ( ((longi1<=longi&&longi<=longi2)||(longi2<=longi&&longi<=longi1))
          &&((lati1 <=lati &&lati <=lati2 )||(lati2 <=lati &&lati <=lati1 )) ){
          sightList.push(s);
        }
      }
      $scope.sightList=sightList;
      $rootScope.sightListIn=sightList;
    }else{
      $scope.sightList=$rootScope.sightListIn;
    }

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

    //载入地点标识
    showSight(map);

    //搜索功能
    //将搜索词加入到后台历史记录功能
    $scope.search=function(query){
      if (query==null) {
        query="";
      }
      $scope.lastQuery=query;
      querySight(map,query);
      if (query!="") {
        $http.get("http://localhost:8080/history/"+$rootScope.user_id+"/"+"query")
          .success(function(ret){
            //if (ret.flag==1){
            //  alert("yes,history.")
            //}
          })
      }
    };

    //图层变换功能
    $scope.layer=function(item){
      if (item.checked){
        addSightEvent(map,item.id);
      }else{
        removeSightEvent(map,item.id);
      }
    };

    //排序功能
    $scope.sortByGrade=function(){
      $scope.sortType='sortByGrade';
      $scope.orderKey='grade';
      $scope.text='平均评分';
    };
    $scope.sortByCollection=function(){
      $scope.sortType='sortByCollection';
      $scope.orderKey='collectionNum';
      $scope.text='收藏数';

    };
    $scope.sortByStep=function(){
      $scope.sortType='sortByStep';
      $scope.orderKey='stepNum';
      $scope.text='足迹人数';
    };
    $scope.sortByWish=function(){
      $scope.sortType='sortByWish';
      $scope.orderKey='wishNum';
      $scope.text='心愿人数';
    };
    $scope.sortByGrade();//默认排序为评分排序

    //搜索功能2
    //将搜索词加入到后台历史记录功能
    $scope.lastQuery2="";
    $scope.search2=function(query){
      if (query==null) {
        query="";
      }
      $scope.lastQuery2=query;
      if (query!="") {
        $http.get("http://localhost:8080/history/"+$rootScope.user_id+"/"+query);
      }
    };

    //时不时地锁定视野，时不时的更新一下scope
    var centralize=function(){
      map.setZoomAndCenter(13, [$rootScope.longi, $rootScope.lati]);
    };
    setInterval(centralize, 1000);

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

  });
