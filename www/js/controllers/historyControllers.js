angular.module('app.historyControllers', [])

  .controller('HistoryCtrl', function($scope,$rootScope,$ionicPopover,$ionicPopup,$http) {

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

    //推荐
    $scope.doRe=function(){
      $http.get("http://localhost:8080/history/get/"+$rootScope.user_id).success(function(ret){
        var i,j,found=[],isFound=false;
        found[0]=0;
        for (i=0;i<ret.length;i++){
          for (j=0;j<$scope.sightList.length;j++){
            if ($scope.sightList[j].sight_name.indexOf(ret[i].history_content)>=0){
              isFound=true;
              if (found[$scope.sightList[j].sight_name]==null){
                found[$scope.sightList[j].sight_name]=1;
              }else{
                found[$scope.sightList[j].sight_name]++;
              }
            }
          }
        }
        if (isFound){
          var line=[];
          for (j=0;j<$scope.sightList.length;j++){
            if (found[$scope.sightList[j].sight_name]!=null){
              line.push({
                sight_name: $scope.sightList[j].sight_name,
                sight_score: found[$scope.sightList[j].sight_name]
              });
            }
          }
          var n=line.length;
          for (i=1;i<=n-1;i++){
            for (j=1;j<=n-i;j++){
              if (line[j-1].sight_score<line[j].sight_score){
                var temp;
                temp=line[j-1];
                line[j-1]=line[j];
                line[j]=temp;
              }
            }
          }
          var text="";
          for (i=0;i<n&&i<=5;i++){
            text=text+
              "<div class='item-text-wrap my-small-padding-up-bottom'>" +
              " <img ng-src='http://localhost:8080/img/my_mark_0.png'/>" +
              " <a href='#/rootTab/sight-detail/"+line[i].sight_name+"'>"+line[i].sight_name+"</a>" +
              " &nbsp&nbsp(推荐指数:"+line[i].sight_score+")" +
              "</div>" +
              "<ion-item class='item-image'></ion-item>";
            text=text+"\n";
          }
          $ionicPopup.alert({
            title: '系统推荐',
            template: text
          });
        }else{
          $ionicPopup.alert({
            title: '系统提示',
            template: '用户使用时间过短,无法根据现有数据推荐'
          });
        }
      });
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
