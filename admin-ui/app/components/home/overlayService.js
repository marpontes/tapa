
(function(){

  var app = angular.module('overlay-service', [] );
  
  /* 
   */
  app.factory('overlayService',['$rootScope',function($rootScope){

  	var lockedBodyClass = "tapa-locked",
  		olHiddenClass = 'tapa-overlay-hidden';
    
    $rootScope.olClasses = ['tapa-overlay','tapa-overlay-hidden'];
    $rootScope.bodyClasses = [];

    function _addClass(cssClass, arr){
		if (arr.indexOf(cssClass)==-1)
			arr.push(cssClass);
    }

    function _removeClass(cssClass, arr){
			var index = arr.indexOf(cssClass);
			arr.splice(index, 1); 
    }

  	return {
  		showOverlay : function(){
			_addClass(lockedBodyClass,$rootScope.bodyClasses);
			_removeClass(olHiddenClass,$rootScope.olClasses);
    	},
    	hideOverlay : function(){
			_removeClass(lockedBodyClass,$rootScope.bodyClasses);
			_addClass(olHiddenClass,$rootScope.olClasses);
	    }

  	};
  	return {};
  }]);

})();