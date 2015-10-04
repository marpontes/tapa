
(function(){

  var app = angular.module('templatesModule');

  app.directive('imgDimensions',[
    function(){
      	return {
      		restrict : 'A',
          link : function(scope, element, attributes){
            var url = scope.img.srcUrl;


            var img = new Image();

            img.onload = function(){
              var height = img.height;
              var width = img.width;

              scope.imgWidth = width;
              scope.imgHeight = height;

            }

            img.src = url;




          }

      	};
  }]);


})();