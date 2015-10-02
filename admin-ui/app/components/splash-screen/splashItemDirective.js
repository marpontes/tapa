(function(){

  var app = angular.module('splashScreenModule');

  app.directive('splashItem',[function(){
    return {
      restrict : 'E',
      templateUrl : 'app/components/splash-screen/splash-item.html',
      controllerAs : 'siCtrl',

      controller : function($scope){

        var ctrl = this;

        this.detailsHidden = true;

        this.toggleDetails = function(){
          ctrl.detailsHidden = !ctrl.detailsHidden;
        }

        this.getArrow = function(){
          return ctrl.detailsHidden ? "keyboard_arrow_down" : "keyboard_arrow_up";
        }


      }
    };

  }]);

})();