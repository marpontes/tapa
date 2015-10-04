
(function(){

  var app = angular.module('templatesModule');

  app.directive('uploaderForm',['templatesService',
    function(templatesService){
      	return {
      		restrict : 'E',
      		templateUrl : 'app/components/templates-list/upload-template.html',
      		controllerAs : "upCtrl",
          	link : function(scope, element, attributes){
          		var inputs = angular.element(element).find("input");
          		scope.fileInputElement = null;

          		for(var x=0 ; x < inputs.length ; x++){
          			var elm = angular.element(inputs[x]);
          			if(elm.attr("type")=="file")
          				scope.fileInputElement = elm;
          		}

              scope.fileInputElement.bind('change',function(){
                var img = scope.img,
                    file = scope.myFile;
                templatesService.getImgUploadCallback()(file,img);
              });

            },
            controller : function($scope){

            	$scope.openFileBrowser = function(){
                $scope.fileInputElement[0].click();
              };

            }

          }

      	
  }])

  .directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){

                  scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }]);


})();