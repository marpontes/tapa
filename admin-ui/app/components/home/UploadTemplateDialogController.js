(function () {

  var app = angular.module('tapa');

  app.controller("UploadTemplateDialogController", 
  	[ '$scope', 'ngProgressFactory','templatesService','$mdDialog', '$window',  
  	  function($scope, ngProgressFactory, templatesService, $mdDialog, $window) {

	    this.cancel = function () {
	      $mdDialog.cancel();
	    };

	    this.upload = function () {
	      var file = $scope.myFile;

	      if (typeof file === 'undefined')
	        return;

	      $scope.progressbar = ngProgressFactory.createInstance();
	      $scope.progressbar.setColor('#fff');
	      $scope.progressbar.start();

	      templatesService
	        .uploadTemplate(file)
	        .then(function (data) {
	          $scope.progressbar.complete();
	          $mdDialog.hide();
	          $window.location.reload();
          });

	    };


      }

  ]);

})();
