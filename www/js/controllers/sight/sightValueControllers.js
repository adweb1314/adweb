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
  .controller('SightValueCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$ionicHistory,$http) {

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

    //构造设施类别框、分类选择框与类型及内容
    $scope.newFacility=[
      {text:"厕所", index:0},
      {text:"卖店", index:1},
      {text:"垃圾桶", index:2},
      {text:"座椅", index:3},
      {text:"其他", index:4}
    ];
    $scope.valueTypeList=[
      {text:"活动类型", value_type:1},
      {text:"场所类型", value_type:2},
      {text:"建议", value_type:3}
    ];
    $scope.valueDescriptionList=[
      [
        {text:"空",value_description:"1"}
      ],
      [
        {text:"运动",value_description:"1"},
        {text:"健身",value_description:"2"},
        {text:"交往活动",value_description:"3"},
        {text:"观赏",value_description:"4"},
        {text:"休憩",value_description:"5"}
      ],
      [
        {text:"亲近自然",value_description:"1"},
        {text:"锻炼健身",value_description:"2"},
        {text:"聚会交友",value_description:"3"},
        {text:"美的体验",value_description:"4"},
        {text:"观察学习",value_description:"5"},
        {text:"休闲减压",value_description:"6"},
        {text:"回归宁静",value_description:"7"}
      ],
      [
        {text:"增加硬质空间",value_description:"1"},
        {text:"增加绿色空间",value_description:"2"},
        {text:"改善到达公共交通",value_description:"3"},
        {text:"改进园内步行系统",value_description:"4"},
        {text:"增加设施",value_description:"5"},
        {text:"其他",value_description:"6"}
      ]
    ];

    //绘制景观地图，获取折线数据并绘制折线，添加单击地图获取经纬度事件
    var map;
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: $scope.sight.sight_zoom,
      center: [$scope.sight.sight_longi, $scope.sight.sight_lati]
    });
    var toolBar = new AMap.ToolBar();
    map.addControl(toolBar);
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
        addMapClickEvent();
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
      addMapClickEvent();
    }

    //点击标识弹出信息框的控制变量
    //单击标识事件的设置
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    function markerClick(e) {
      infoWindow.setContent(e.target.content);
      infoWindow.open(map, e.target.getPosition());
    }

    //获取value数据并标记value
    if ($rootScope.valueName==null||$rootScope.valueName!=$scope.sight_name) {
      $http.get("http://localhost:8080/value/"+$scope.sight_name).success(function(ret){
        $rootScope.valueName=$scope.sight_name;
        $rootScope.value=ret;
        $scope.value=ret;
        firstDrawValue();
        drawValue($scope.valueTypeList[0]);
      })
    }else{
      $scope.value=$rootScope.value;
      firstDrawValue();
      drawValue($scope.valueTypeList[0]);
    }

    //初始化画value标识的函数
    function firstDrawValue(){
      var i;
      markers=[];
      for (i=0;i<$scope.value.length;i++){
        var v=$scope.value[i];
        var marker = new AMap.Marker({
          map: map,
          icon: "http://localhost:8080/img/my_mark_"+v.value_description+".png",
          position: [v.value_longi, v.value_lati]
        });
        markers.push(marker);
      }
    }
    //画已有value标识的函数
    function drawValue(selectedType){
      //前台切换时依赖的变量
      $scope.selectedType=selectedType;
      //先全部删掉
      var i;
      for (i=0;i<$scope.value.length;i++){
        markers[i].setMap(null);
      }
      //再添加需要的
      for (i=0;i<$scope.value.length;i++){
        if ($scope.value[i].value_type==selectedType.value_type){
          markers[i] = new AMap.Marker({
            map: map,
            icon: "http://localhost:8080/img/my_mark_"+$scope.value[i].value_description+".png",
            position: [$scope.value[i].value_longi, $scope.value[i].value_lati]
          });
          if ($scope.value[i].value_type==3&&($scope.value[i].value_description==5||$scope.value[i].value_description==6)){
            var marker=markers[i];
            marker.content=$scope.value[i].value_content;
            marker.on('click',markerClick);
            marker.emit('click',{target:marker});
          }
        }
      }
    }
    $scope.drawValue=function(selectedType){
      drawValue(selectedType);//前台切换使用
    };

    //ng-click点击图标以准备新建一个addValue的函数
    var prepare=function(i,j,selected,info){
      //弹出用户提示与引导
      $ionicPopup.alert({
        title: '系统提示',
        template: '在地图上相应位置触摸，新建评价'
      });
      //设置标记，记录数据
      var mouseTool = new AMap.MouseTool(map);
      mouseTool.marker({icon:"http://localhost:8080/img/my_mark_"+j.value_description+".png"});
      $scope.ii=i;
      $scope.jj=j;
      if (info==null)
        info="nothing here";
      if (selected!=null){
        if (selected.index!=$scope.newFacility.length-1){
          info=selected.text;
        }
      }
      $scope.info=info;
    };
    $scope.addValue=function(i,j,selected,info){
      if (i.value_type==3&&j.value_description==5){
        //[设施]
        if (selected==null){
          //未选择设施
          $ionicPopup.alert({
            title: '系统提示',
            template: '必须先选择设施'
          });
        }else if (selected.index==$scope.newFacility.length-1){
          //选择其他设施
          if (info==null||info==""){
            $ionicPopup.alert({
              title: '系统提示',
              template: '"其他"描述不能为空'
            });
          }else{
            //alert(selected.text);
            //alert(info);
            prepare(i,j,selected,info);
          }
        }else{
          //选择已有设施
          //alert(selected.text);
          prepare(i,j,selected,info);
        }
      }else if (i.value_type==3&&j.value_description==6){
        //[其他]
        if (info==null||info==""){
          $ionicPopup.alert({
            title: '系统提示',
            template: '"其他"描述不能为空'
          });
        }else{
          //alert(info);
          prepare(i,j,selected,info);
        }
      }else{
        //[一般]
        prepare(i,j,selected,info);
      }
    };

    //“鼠标单击地图” 事件注册函数：
    //  点击鼠标获取经纬度之后默认什么都不做
    //  若切换过addValue的图标，则将获取的经纬度加入数据库，并通知,退出
    function addMapClickEvent(){
      map.on('click', function(e) {
        var lati=e.lnglat.getLat();
        var longi=e.lnglat.getLng();
        //加入数据库，并通知,更新scope与rootScope，退出
        if ($scope.ii!=null){
          //alert("["+longi+lati+"]"+$scope.ii.text+","+$scope.jj.text+"已加入数据库");
          $scope.value.push({
            value_id: 233,
            sight_name: $scope.sight_name,
            value_lati: lati,
            value_longi: longi,
            value_type: $scope.ii.value_type,
            value_description: $scope.jj.value_description,
            value_content: $scope.info
          });
          $rootScope.value=$scope.value;
          $http.get("http://localhost:8080/value/"
            +$scope.sight_name+"/"
            +lati+"/"
            +longi+"/"
            +$scope.ii.value_type+"/"
            +$scope.jj.value_description+"/"
            +$scope.info).success(function(ret){
              if (ret.flag==1){
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '添加评价成功'
                });
                $ionicHistory.goBack();
              }
            });
        }
        //else{
        //  alert("未选择value图标");
        //}
      });
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
