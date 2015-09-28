(function(){

  var app = angular.module(
  	'tapa',
  	[
  		'splashScreenModule',
  		'sideMenuModule',
  		'ngMaterial',
  		'footerModule',
  		'templatesModule'
  	]
  ).config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('purple');
  }).controller("PortalController",['$window',function($window){

    this.openNewWindow = function(){
      $window.open("./index.html");
    };

  }]);

})();