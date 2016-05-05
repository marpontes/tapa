(function(){

  var app = angular.module('sideMenuModule');

  app.factory('configService', ['$http', function($http) {

  		var _showSplash = null,
  		    _splashCallback = function(){},
  		    _splashObserverCallbacks = [];

	    return {

	    	registerSplashObserverCallback : function(callback){
			    _splashObserverCallbacks.push(callback);
			},

			registerSplashCallback : function(callback){
				_splashCallback = callback
			},

			getSplashCallback : function(){
				return _splashCallback;
			},

			clearSplashObservers : function(){
				_splashObserverCallbacks = [];
			},

			notifySplashObservers : function(){
			    angular.forEach(_splashObserverCallbacks, function(callback){
			      callback();
			    });
			 },

	    	setShowSplash : function(newValue){
	    		_showSplash = newValue;
	    	},

	    	getShowSplash : function(){
	    		return _showSplash;
	    	},

	    	getConfig : function(){
				var url = "../../../plugin/tapa/api/getconfig";
		    	return $http.get(url);
	    	},

	    	disablePlugin : function(){
	    		var url = "../../../plugin/tapa/api/disableplugin";
		    	return $http.get(url);
	    	},

	    	enablePlugin : function(){
	    		var url = "../../../plugin/tapa/api/enableplugin";
		    	return $http.get(url);
	    	},

	    	setSplashScreen : function(showSplashScreen){
	    		var url = "../../../plugin/tapa/api/setsplashscreen?paramshowSplashScreen="
	    					+showSplashScreen;
		    	return $http.get(url);
	    	}



	    };
	}]);

})();
