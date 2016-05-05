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
				var url = "../../../plugin/tapa/api/gettemplateslist";
		    	return $http.get(url);
	    	},

	    	activateTemplate : function(templateName){
				var url = "../../../plugin/tapa/api/activatetemplate?paramtemplate="
							+encodeURIComponent(templateName);
		    	return $http.get(url);
	    	},

	    	submitChanges : function(old, newGuy){
	    		var newStr = JSON.stringify(newGuy),
	    			url = "../../../plugin/tapa/api/edittemplate?paramtemplate="
							+encodeURIComponent(old.name)+'&paramnewData='+ encodeURIComponent(newStr);
		    	return $http.get(url);
	    	},

	    	getAssetsListForTemplate : function(templateName, type){

	    		var endpoint = type=="img" ? "gettemplateimages" : "gettemplateassets";

	    		var url = "../../../plugin/tapa/api/"+endpoint+"?paramtemplate="
							+encodeURIComponent(templateName)+"&paramassetsType="+encodeURIComponent(type);

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
	    			url = "../../../plugin/tapa/api/upload/send";

        		fd.append('file', file);
        		fd.append('endpointPath', "plugin/tapa/api/imagepostprocessor");
        		fd.append('queryParameters', "&paramtemplate="+template+"&paramimgUrl="+encodeURIComponent(imgUrl));

		        return $http.post(url, fd, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        });
	    	},

	    	uploadTemplate : function(file){

	    		var fd = new FormData(),
	    			url = "../../../plugin/tapa/api/upload/send";

        		fd.append('file', file);
        		fd.append('endpointPath', "plugin/tapa/api/templatepostprocessor");
        		fd.append('queryParameters', "");

		        return $http.post(url, fd, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        });
	    	}

	    };
	}]);

})();
