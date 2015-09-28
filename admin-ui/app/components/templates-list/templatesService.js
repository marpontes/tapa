(function(){

  var app = angular.module('templatesModule');

  app.factory('templatesService', ['$http', function($http) {

  	var _current = null;

	    return {

	    	getCurrent : function(){
	    		return _current;
	    	},
	    	setCurrent : function(template){
	    		_current = template;
	    	},

	    	getTemplatesList : function(){
				var url = "/pentaho/plugin/tapa/api/gettemplateslist";
		    	return $http.get(url);
	    	},

	    	activateTemplate : function(templateName){
				var url = "/pentaho/plugin/tapa/api/activatetemplate?paramtemplate="
							+templateName;
		    	return $http.get(url);
	    	},

	    	submitChanges : function(old, newGuy){

	    		var newStr = JSON.stringify(newGuy),
	    			url = "/pentaho/plugin/tapa/api/edittemplate?paramtemplate="
							+old.name+'&paramnewData='+ newStr;

							console.log(newStr);

		    	return $http.get(url);
	    	}

	    };
	}]);

})();