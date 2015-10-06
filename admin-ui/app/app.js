(function(){

  var app = angular.module(
  	'tapa',
  	[
  		'splashScreenModule',
  		'sideMenuModule',
  		'ngMaterial',
  		'footerModule',
  		'templatesModule',
      'ngAnimate'
  	]
  ).config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('purple');
  }).controller("PortalController",['$window','configService','$mdDialog','$document',
  function($window,configService,$mdDialog,$document){

    this.openNewWindow = function(){
      $window.open("./index.html");
    };

    this.showSplash = function(){
      configService.getSplashCallback()();
    }

    this.uploadTemplate = function(ev){

      $mdDialog.show({
        controller: 'UploadTemplateDialogController',
        controllerAs: 'utCtrl',
        templateUrl: 'app/components/home/upload-template-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose:true

      });
    };

  }]);

  Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
      value: function() {
          function pad2(n) {  // always returns a string
              return (n < 10 ? '0' : '') + n;
          }

          return this.getFullYear() +
                 pad2(this.getMonth() + 1) + 
                 pad2(this.getDate()) +
                 pad2(this.getHours()) +
                 pad2(this.getMinutes()) +
                 pad2(this.getSeconds());
      }
  });

})();