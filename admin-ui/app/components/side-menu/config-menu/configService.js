(function(){

  var app = angular.module('config-service',[]);

  app.factory('configService', ['$http', function($http) {

	    return {

	    	getConfig : function(){
				var url = "/pentaho/plugin/tapa/api/getconfig";
		    	return $http.get(url);
	    	},

	    	disablePlugin : function(){
	    		var url = "/pentaho/plugin/tapa/api/disableplugin";
		    	return $http.get(url);
	    	},

	    	enablePlugin : function(){
	    		var url = "/pentaho/plugin/tapa/api/enableplugin";
		    	return $http.get(url);
	    	},

	    	setSplashScreen : function(showSplashScreen){
	    		var url = "/pentaho/plugin/tapa/api/setsplashscreen?paramshowSplashScreen="
	    					+showSplashScreen;
		    	return $http.get(url);
	    	}

	    };
	}]);

})();