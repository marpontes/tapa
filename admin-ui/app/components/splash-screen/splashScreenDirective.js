(function(){

  var app = angular.module('splash-screen-directive',[]);

  app.directive('splashScreen',function(){
    return {
      restrict : 'E',
      templateUrl : 'app/components/splash-screen/splash-screen.html',
      controllerAs : 'splashCtrl',

      controller : function($scope){

        tapa = this;
        this.showSplash = isShowSplash();

        function isShowSplash() {
          return false;
        }

        $scope.disposeSplash = function(){
          tapa.showSplash = false;
        }

      }

    };
  });

})();