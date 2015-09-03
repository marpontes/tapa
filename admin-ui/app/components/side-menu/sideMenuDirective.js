(function(){

  var app = angular.module(
    'sideMenuModule',
    ['overlayModule']);

  app.directive('sideMenu',['overlayService',function(overlayService){
    return {
      restrict : 'E',
      templateUrl : 'app/components/side-menu/side-menu.html',
      controllerAs : 'sideMenuCtrl',

      controller : function($scope){

        var sideMenu = this;

        var menuSide = null;

        /* TODO: Remove these DOM manipulations
         */
        $scope.showMenu = function(side){
          overlayService.showOverlay($scope.disposeMenu);
          $(".tapa-side-menu.tapa-side-menu-"+side).removeClass('tapa-side-menu-hidden');
        };

        $scope.disposeMenu = function(){
          $(".tapa-side-menu").addClass('tapa-side-menu-hidden');
          overlayService.hideOverlay();
        };

      }

    };
  }]);

})();