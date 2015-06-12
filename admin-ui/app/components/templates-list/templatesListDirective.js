
(function(){

  var app = angular.module('templates-list-directive', ['templates-service'] );

  app.directive('templatesList',['templatesService','$mdDialog','$timeout', function(templatesService,$mdDialog,$timeout){
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

  		}

  	}
  }]);

 

})();