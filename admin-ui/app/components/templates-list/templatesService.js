(function(){

  var app = angular.module('templatesModule');

  app.factory('templatesService', ['$http', function($http) {

  	var _current = null,
  		_imgUploadCallback = null;

	    return {

	    	setImgUploadCallback : function(callback){
	    		_imgUploadCallback = callback;
	    	},

	    	getImgUploadCallback : function(){
	    		return _imgUploadCallback;
	    	},

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
		    	return $http.get(url);
	    	},

	    	getAssetsListForTemplate : function(templateName, type){

	    		var endpoint = type=="img" ? "gettemplateimages" : "gettemplateassets";

	    		var url = "/pentaho/plugin/tapa/api/"+endpoint+"?paramtemplate="
							+templateName+"&paramassetsType="+type;

		    	return $http.get(url);
	    	},

	    	getTemplatePath : function(templateName){
	    		return "../resources/templates/"+templateName+'/';
	    	},

	    	getJsCss : function(templateName){
	    		return this.getAssetsListForTemplate(templateName,"jscss");
	    	},

	    	getImages : function(templateName){
	    		return this.getAssetsListForTemplate(templateName,"img");
	    	},

	    	uploadImage : function(template,file,imgUrl){

	    		var fd = new FormData(),
	    			url = "/pentaho/plugin/tapa/api/upload/send";

        		fd.append('file', file);
        		fd.append('endpointPath', "plugin/tapa/api/imagepostprocessor");
        		fd.append('queryParameters', "&paramtemplate="+template+"&paramimgUrl="+imgUrl);

		        return $http.post(url, fd, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        });
	    	}

	    };
	}]);

})();