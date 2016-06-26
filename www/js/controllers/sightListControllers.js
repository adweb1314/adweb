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
    };
    $scope.sortByCollection=function(){
      $scope.sortType='sortByCollection';
    };
    $scope.sortByStep=function(){
      $scope.sortType='sortByStep';
    };
    $scope.sortByWish=function(){
      $scope.sortType='sortByWish';
    };

    //搜索功能
    //将搜索词加入到后台历史记录功能（待开发）
    $scope.lastQuery="";
    $scope.search=function(query){
      if (query==null) {
        query="";
      }
      $scope.lastQuery=query;
    };

    //滑动框默认格式
    $scope.myActiveSlide = 1;

    //获取用户数据
    $scope.sightList=$rootScope.sightList;
    $scope.sightTypeList=$rootScope.sightTypeList;
    if ($scope.sightList==null){
      $http.get("http://localhost:8080/sight")
        .success(function(ret) {
          $scope.sightList = ret;
          $http.get("http://localhost:8080/sight_type")
            .success(function (ret) {
              $scope.sightTypeList = ret;
            })
        })
    }

    //默认排序为评分排序
    $scope.sortByGrade();

  })

  //单个景观页面控制
  .controller('SightCtrl', function($scope,$rootScope,$stateParams,$ionicHistory,$ionicPopover) {

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

    //获取用户数据
    $scope.sightList=$rootScope.sightList;
    var i;
    for (i=0;i<$scope.sightList.length;i++){
      if ($scope.sightList[i].sight_name==$scope.sight_name){
        $scope.sight=$scope.sightList[i];
        break;
      }
    }

    //假数据
    $scope.sightCommentList=[
      {sight_comment:'很好',sight_grade:4},
      {sight_comment:'非常好',sight_grade:5},
      {sight_comment:'一般好',sight_grade:3}
    ];

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
  .controller('SightCommentCtrl', function($scope,$rootScope,$stateParams,$ionicPopover) {

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
