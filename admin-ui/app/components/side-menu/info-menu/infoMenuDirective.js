(function(){

  var app = angular.module('info-menu-directive',[]);

  app.directive('infoMenu',function(){
    return {
      restrict : 'E',
      templateUrl : 'app/components/side-menu/info-menu/info-menu.html',
      controllerAs : 'infoCtrl',

      controller : function($scope){
        this.openGithub = function(){
          window.open("http://github.com/marpontes/tapa");
        };

      }

    };
  });

})();