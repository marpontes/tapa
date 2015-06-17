(function(){

  var app = angular.module(
    'side-menu-directive',
    ['config-menu-directive','info-menu-directive','overlay-service']);

  app.directive('sideMenu',['overlayService',function(overlayService){
    return {
      restrict : 'E',
      templateUrl : 'app/components/side-menu/side-menu.html',
      controllerAs : 'sideMenuCtrl',

      controller : function($scope){

        var sideMenu = this;

        var menuSide = null;

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