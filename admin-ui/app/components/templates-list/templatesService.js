(function(){

  var app = angular.module('templatesModule');

  app.factory('templatesService', ['$http', function($http) {

	    return {

	    	getTemplatesList : function(){
				var url = "/pentaho/plugin/tapa/api/gettemplateslist";
		    	return $http.get(url);
	    	},

	    	activateTemplate : function(templateName){
				var url = "/pentaho/plugin/tapa/api/activatetemplate?paramtemplate="
							+templateName;
		    	return $http.get(url);
	    	}

	    };
	}]);

})();