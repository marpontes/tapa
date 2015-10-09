
(function(){

  var app = angular.module('templatesModule', ['waypointModule','ngProgress'] );

  app.directive('templatesList',['templatesService','$mdDialog','$timeout', '$document','$window','ngProgressFactory',
    function(templatesService,$mdDialog,$timeout,$document,$window, ngProgressFactory){
      	return {
      		restrict : 'E',
      		templateUrl : 'app/components/templates-list/templates-list.html',
      		controllerAs : 'templatesListCtrl',
      		controller : function() {

            var templatesListCtrl = this;

            this.templates = [];

            this.init = function(){
              templatesService.getTemplatesList()
              .success(function(data, status, headers, config){
                templatesListCtrl.templates=data;
              })
              .error(function(){
                console.log("[Tapa Plugin] Error loading Templates list");
              });
            };

            this.getContextualizedPath = function(relativePath, template){
              return "../resources/templates/"+template.name+"/"+relativePath
            }

            this.activateTemplate = function(template, ev){

              if (template.active === true)
                return;

                var confirm = $mdDialog.confirm()
                  .parent(angular.element(document.body))
                  .title('Enable template "'+template.name+'"?')
                  .content("The change you do will take place immediately .")
                  .ariaLabel('Lucky day')
                  .ok('Yes, enable '+template.name+'!')
                  .cancel('Cancel')
                  .targetEvent(ev);
                // When ok clicked
                $mdDialog.show(confirm).then(function() {
                  // Call activateTemplate
                  templatesService.activateTemplate(template.name)
                  // When server answers successfully
                  .success(function(){
                    // Load controls again
                    templatesListCtrl.templates = [];
                    $timeout( templatesListCtrl.init, 1000);
                 
                  })
                  // If error disabling plugin, enable switch
                  .error(function(){
                    console.log("[Tapa Plugin] Error activating Template");
                  });
                }, function() {
                  console.log("[Tapa Plugin] Nothing Changed");
                });
            };

            this.edit = function(template, ev){
              templatesService.setCurrent(template);

              $mdDialog.show({
                controller: 'EditDialogController',
                controllerAs: 'editCtrl',
                templateUrl: 'app/components/templates-list/edit-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose:true

              });
            };

            this.download = function(template, ev){
              $window.open( 
                "../../../plugin/tapa/api/downloadtemplate?paramtemplate="+
                template.name);

            };

            this.preview = function(template, ev){
              $window.open(  
                "../../../plugin/tapa/api/templateservice/preview?template="+
                template.name);

            };

      		}

      	}
  }]);


})();