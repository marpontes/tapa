(function(){

  var app = angular.module(
  	'tapa',
  	[
  		'splash-screen-directive',
  		'side-menu-directive',
  		'ngMaterial',
  		'waypoint-config-directive',
  		'tapa-footer-directive',
  		'templates-list-directive'
  	]
  ).config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('purple');
      })

})();