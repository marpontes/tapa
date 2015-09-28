
(function(){

  var app = angular.module('templatesModule', ['waypointModule'] );

  app.directive('templatesList',['templatesService','$mdDialog','$timeout', '$document',
    function(templatesService,$mdDialog,$timeout,$document){
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
                controller: EditDialogController,
                controllerAs: 'editCtrl',
                templateUrl: 'app/components/templates-list/edit-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose:true

              })
              .then(function(answer) {
                console.log('You said the information was "' + answer + '".');
              }, function() {
                console.log( 'You cancelled the dialog.');
              });
            };

      		}

      	}
  }]);

function EditDialogController($scope, $mdDialog, templatesService){
  var _original = templatesService.getCurrent(),
      ctrl = this;

  this.current = angular.copy(_original);
  this.current.textTags = this.current.textTags !== undefined ? this.current.textTags  : [] ;

  this.cancel = function(){
    $mdDialog.cancel();
  };

  this.hide = function(){
    $mdDialog.hide();
  };

  this.submit = function(){
    templatesService.submitChanges(_original, ctrl.current)
    .success(function(data, status, headers, config){
      console.log(data);
      ctrl.hide();
    })
    .error(function(a,b,c){
      "[Tapa Plugin] Error loading Templates list";
      console.log(a);
      console.log(b);
      console.log(c);
    });

    //needs to be called from within a promise
    
  };

  this.addTag = function(){
    ctrl.current.textTags.push({
      "tag" : "NEW_TAG",
      "value" : "----Write here----"
    });
  };

  this.removeTag = function(tag){
    var arr = ctrl.current.textTags;
    for(var i=0;i<arr.length;i++){
      if(arr[i].tag == tag.tag){

        // Sorry IE 7,8 users. U have to update that crap
        arr.splice(i,1);
      }
    }
  };





}

})();