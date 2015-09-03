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
      })

})();