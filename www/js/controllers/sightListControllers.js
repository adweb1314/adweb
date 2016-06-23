angular.module('app.sightListControllers',[])

  .controller('SightListCtrl', function($scope,$rootScope) {

    $scope.myActiveSlide = 1;

    $scope.sightList=$rootScope.sightList;
    $scope.sightTypeList=$rootScope.sightTypeList;

    //一波假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据假数据
    $scope.sightTypeList=[
      {sight_type_id:1,sight_type_name:'北京冷'},
      {sight_type_id:2,sight_type_name:'南京暖'},
      {sight_type_id:3,sight_type_name:'东京热'},
    ]
    $scope.sightList=[
      {sight_name:'天安门',sight_type_id:1},
      {sight_name:'天坛',sight_type_id:1},
      {sight_name:'中山陵',sight_type_id:2},
      {sight_name:'11区',sight_type_id:3},
      {sight_name:'亚邦天井',sight_type_id:3},
      {sight_name:'幻想乡',sight_type_id:3},
    ]

  });
