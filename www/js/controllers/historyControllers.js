angular.module('app.historyControllers', [])

  .controller('HistoryCtrl', function($scope,$rootScope,$ionicPopover,$http) {

    //前进时禁止回退
    $scope.doForward=function(){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    };

    //取得地点数据、类型数据、历史数据、默认排序
    $http.get("http://localhost:8080/history/get/"+$rootScope.user_id).success(function(ret){
      $scope.historyList=ret;
      $scope.sightList=$rootScope.sightList;
      $scope.sightTypeList=$rootScope.sightTypeList;
      $scope.filter="";
      $scope.filter2="";
      $scope.sortByGrade();
    });

    //滑动框默认格式
    $scope.myActiveSlide = 1;

    //选择补全内容函数
    $scope.setFilter2=function(newFilter){
      $scope.filter2=newFilter;
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
