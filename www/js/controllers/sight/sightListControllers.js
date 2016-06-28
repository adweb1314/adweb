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
        var j,grade=0,gradeNum=[ret.length,0,0,0,0,0];
        for (j=0;j<ret.length;j++){
          grade+=Number(ret[j].grade);
          gradeNum[Number(ret[j].grade)]++;
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
                gradeNum: gradeNum,
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
          var tempList=[{
            sight_type_id:0,
            sight_type_name:"全部类别"
          }];
          var i;
          for (i=0;i<ret.length;i++){
            tempList.push(ret[i])
          }
          $scope.sightTypeList = tempList;
          $rootScope.sightTypeList = tempList;
          getSortData();
        })
      })
    }else{
      $scope.sightList=$rootScope.sightList;
      $scope.sightTypeList=$rootScope.sightTypeList;
      //默认排序为评分排序
      $scope.sortByGrade();
    }
  });
