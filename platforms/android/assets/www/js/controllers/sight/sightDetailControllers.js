angular.module('app.sightDetailControllers',[])

  //详细资料页面控制
  .controller('SightDetailCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$ionicActionSheet,$http) {

    //分享功能
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

    //获取景观数据
    $scope.sightList=$rootScope.sightList;
    var i;
    for (i=0;i<$scope.sightList.length;i++){
      if ($scope.sightList[i].sight_name==$scope.sight_name){
        $scope.sight=$scope.sightList[i];
        break;
      }
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

    //报错
    $scope.baocuo=function(){
      $ionicPopup.show({
        template: '<input type="text" ng-model="info">',
        title: '请输入报错信息',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>发送</b>',
            type: 'button-positive',
            onTap: function(e) {
              $ionicPopup.alert({
                title: '系统提示',
                template: '报错提交成功'
              });
            }
          }
        ]
      })
    };

    //上传文件菜单
    $scope.show = function() {
      $ionicActionSheet.show({
        buttons: [
          { text: '选择文件' },
          { text: '上传文件' }
        ],
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          switch(index){
            case 0: $('#file').click();return false;
            case 1: $scope.fileUpload();
              return true;
          }
        }
      });
    };

    //取得所有资源
    var getAll=function(){
      $http.get("http://localhost:8080/resource/"+$scope.sight_name).success(function(ret){
        $scope.res=ret;
      });
    };
    getAll();

    //上传头像
    $scope.fileUpload = function () {
      var s="http://localhost:8080/publicUpload";
      var formData = new FormData($('#fileForm')[0]);
      $.ajax({
        url: s,  //Server script to process data
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(ret){
          if (ret!=null&&ret!=""){
            ret=ret.replace('.','I');
            var type="0";
            if (ret.toLowerCase().indexOf("mp4")>=0||
              ret.toLowerCase().indexOf("webm")>=0||
              ret.toLowerCase().indexOf("ogg")>=0||
              ret.toLowerCase().indexOf("mpeg")>=0){
              type="1";
            }
            $http.get("http://localhost:8080/resource/"+ret+"/"+$scope.sight_name+"/"+type).success(function(ret){
              if (ret.flag==1){
                getAll();
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '文件上传成功'
                });
              }else{
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '文件上传失败'
                });
              }
            });
          }else{
            $ionicPopup.alert({
              title: '系统提示',
              template: '文件上传失败'
            });
          }
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

  })

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

  //调查问卷页面控制
  .controller('SightSurveyCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicPopover,$ionicHistory) {

    //url参数传递
    $scope.sight_name = $stateParams.sight_name;
    $scope.user_id=$rootScope.user_id;

    //定义问题
    $scope.singleAns=[0];
    $scope.single=[
      {
        index: 0,
        question: "你喜欢这个景观吗？",
        option:[
          {index:0,answer:"喜欢"},
          {index:1,answer:"一般"},
          {index:2,answer:"不喜欢"}
        ]
      }
    ];
    $scope.multi=[
      {
        index: 0,
        question: "景观给你带来了什么？",
        option:[
          {index:0,answer:"轻松的环境",checked:true},
          {index:1,answer:"快乐的体验",checked:true},
          {index:2,answer:"美不胜收的景色",checked:true}
        ]
      },
      {
        index: 1,
        question: "哪些地方你不满意？",
        option:[
          {index:0,answer:"人太多",checked:false},
          {index:1,answer:"车太多",checked:false},
          {index:2,answer:"票太贵",checked:false},
          {index:3,answer:"饭太水",checked:false}
        ]
      }
    ];
    $scope.other=[
      {
        index: 0,
        question: "游览的感想"
      },
      {
        index: 1,
        question: "你想要对管理方说的话"
      }
    ];

    //提交函数
    $scope.submit=function(){
      $ionicPopup.alert({
        title: '系统提示',
        template: '提交成功'
      });
      $ionicHistory.goBack();
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
