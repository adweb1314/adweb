angular.module('app.sightListControllers',[])

  //rootTab-sightList控制
  .controller('SightListCtrl', function($scope,$rootScope,$ionicHistory,$ionicPopup,$http) {
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

  })

  //单个景观页面控制
  .controller('SightCtrl', function($scope,$rootScope,$stateParams,$ionicHistory,$ionicPopover,$ionicPopup,$http) {
    $scope.share=function(sight){
      $ionicPopup.prompt({
        title: '分享',
        template: '你要分享给谁：',
        inputType: 'text',
        inputPlaceholder: '请输入对方id'
      }).then(function(res)
      {
        if(res === undefined || res === "")
          return;
        $http.get("http://localhost:8080/user/name/"+res)
          .success(function(ret){
              if(ret.user_name === "null") {
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '该用户不存在'
                });
              }
              else
                $http.get("http://localhost:8080/share/add/"+$rootScope.user_id+"/"+ sight +"/"+res)
                  .success(function(ret){
                    $ionicPopup.alert({
                      title: '系统提示',
                      template: '分享成功'
                    });
                });
            })
            .error(function() {
              $ionicPopup.alert({
                title: '系统提示',
                template: '无法得到用户信息'
              });
            });

      });
    };
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

    //绘制景观地图，得到折线数据并绘制折线
    var map;
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: $scope.sight.sight_zoom,
      center: [$scope.sight.sight_longi, $scope.sight.sight_lati]
    });
    if ($rootScope.lineName==null||$rootScope.lineName!=$scope.sight_name){
      $http.get("http://localhost:8080/line/"+$scope.sight_name).success(function(ret){
        $rootScope.lineName=$scope.sight_name;
        var i,line=[];
        for (i=0;i<ret.length;i++){
          var l=[ret[i].line_longi, ret[i].line_lati];
          line.push(l);
        }
        if (ret.length>0){
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
        }
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
    }

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
    var getAllComment=function(){
      $http.get("http://localhost:8080/comment/"+$scope.sight_name)
        .success(function(ret){
          var i,tempList=[];
          for (i=ret.length-1;i>=0&&i>=ret.length-5;i--){
            tempList.push(ret[i]);
          }
          $scope.sightCommentList=tempList;
          $scope.cancelExpand2();
        });
    };
    getAllComment();

    //选择路径导航时
    $scope.goRoute=function(){
      $scope.doForward();
      $rootScope.dest={
        name:$scope.sight.sight_name,
        lati:$scope.sight.sight_lati,
        longi:$scope.sight.sight_longi};
    };

    //新建评论功能
    $scope.addComment=function(grade,comment){
      $http.get("http://localhost:8080/comment/"
        +$rootScope.user_id+"/"+$scope.sight_name+"/"+grade+"/"+comment).success(function(ret){
        if (ret.flag==1){
          getAllComment();
          $ionicPopup.alert({
            title: '系统提示',
            template: '评论成功'
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

  });
