angular.module('app.sightListControllers',[])

  //rootTab-sightList控制
  .controller('SightListCtrl', function($scope,$rootScope,$ionicHistory,$http) {

    //前进时禁止回退
    $scope.doForward=function(){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    };

    //详细信息展开与收回
    $scope.expand=false;
    $scope.doExpand=function(){
      $scope.expand=true;
    };
    $scope.cancelExpand=function(){
      $scope.expand=false;
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

    //搜索功能
    //将搜索词加入到后台历史记录功能
    $scope.lastQuery="";
    $scope.search=function(query){
      if (query==null) {
        query="";
      }
      $scope.lastQuery=query;
      if (query!="") {
        $http.get("http://localhost:8080/history/"+$rootScope.user_id+"/"+query);
      }
    };

    //滑动框默认格式
    $scope.myActiveSlide = 1;

    //提取排序需要的评分（处理为平均评分）、收藏、足迹、心愿的数据的函数
    // 并设置默认排序为评分排序的函数
    var getOneDate=function(s){
      $http.get("http://localhost:8080/comment/"+s.sight_name).success(function(ret){
        var j,grade=0;
        for (j=0;j<ret.length;j++){
          grade+=Number(ret[j].grade);
        }
        if (ret!=null&&ret.length>0){
          grade=grade/ret.length;
        }
        $http.get("http://localhost:8080/collectionNum/"+s.sight_name).success(function(ret){
          var collectionNum=ret.num;
          $http.get("http://localhost:8080/stepNum/"+s.sight_name).success(function(ret){
            var stepNum=ret.num;
            $http.get("http://localhost:8080/wishNum/"+s.sight_name).success(function(ret){
              var wishNum=ret.num;
              $scope.sightListNew.push({
                sight_name: s.sight_name,
                sight_description: s.sight_description,
                sight_type_id: s.sight_type_id,
                sight_lati: s.sight_lati,
                sight_longi: s.sight_longi,
                sight_zoom: s.sight_zoom,
                sight_detail: s.sight_detail,
                grade: -grade,
                collectionNum: -collectionNum,
                stepNum: -stepNum,
                wishNum: -wishNum
              });
            });
          });
        });
      });
    };
    var getSortData=function(){
      $scope.sightListNew=[];
      var i;
      for (i=0;i<$rootScope.sightList.length;i++){
        getOneDate($rootScope.sightList[i]);
      }
      $scope.sightList=$scope.sightListNew;
      $rootScope.sightList=$scope.sightListNew;
      //默认排序为评分排序
      $scope.sortByGrade();
    };

    //获取用户数据
    if ($rootScope.sightList==null||$rootScope.sightList[0].grade==null){
      $http.get("http://localhost:8080/sight").success(function(ret) {
        //$scope.sightList = ret;
        $rootScope.sightList = ret;
        $http.get("http://localhost:8080/sight_type").success(function (ret) {
          $scope.sightTypeList = ret;
          $rootScope.sightTypeList = ret;
          getSortData();
        })
      })
    }else{
      $scope.sightList=$rootScope.sightList;
      $scope.sightTypeList=$rootScope.sightTypeList;
      //默认排序为评分排序
      $scope.sortByGrade();
    }
  })

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
    //绘制景观地图
    var map;
    map = new AMap.Map('container', {
      zoom: $scope.sight.sight_zoom,
      center: [$scope.sight.sight_longi, $scope.sight.sight_lati]
    });

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
    $http.get("http://localhost:8080/comment/"+$scope.sight_name)
      .success(function(ret){
        var i,tempList=[];
        for (i=ret.length-1;i>=0&&i>=ret.length-5;i--){
          tempList.push(ret[i]);
        }
        $scope.sightCommentList=tempList;
      });

    //选择路径导航时
    $scope.goRoute=function(){
      $scope.doForward();
      $rootScope.dest={
        name:$scope.sight.sight_name,
        lati:$scope.sight.sight_lati,
        longi:$scope.sight.sight_longi};
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
  .controller('SightDetailCtrl', function($scope,$rootScope,$stateParams,$ionicPopover) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;

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

  //所有评论页面控制
  .controller('SightCommentCtrl', function($scope,$rootScope,$stateParams,$ionicPopover,$http) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;

    //获取评论数据
    $http.get("http://localhost:8080/comment/"+$scope.sight_name)
      .success(function(ret){
        var i,tempList=[];
        for (i=ret.length-1;i>=0;i--){
          tempList.push(ret[i]);
        }
        $scope.sightCommentList=tempList;
      });

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
  .controller('SightValueCtrl', function($scope,$rootScope,$stateParams,$ionicPopover) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;

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
