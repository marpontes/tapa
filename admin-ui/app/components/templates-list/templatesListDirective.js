
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
                controller: EditDialogController,
                controllerAs: 'editCtrl',
                templateUrl: 'app/components/templates-list/edit-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose:true

              })
              .then(function(answer) {
                
              }, function() {
                
              });
            };

            this.download = function(template, ev){
              $window.location = 
                "../../../plugin/tapa/api/downloadtemplate?paramtemplate="+
                template.name;

            };

      		}

      	}
  }]);



function EditDialogController($scope, $mdDialog, templatesService, $window, $document, $timeout, ngProgressFactory){

  var _original = templatesService.getCurrent(),
      ctrl = this,
      _templateAssets = new Array(),
      _templateImages = new Array(),
      _imageChanged = false;

  this.current = angular.copy(_original);
  this.current.textTags = this.current.textTags !== undefined ? this.current.textTags  : [] ;

  this.cancel = function(){
    $mdDialog.cancel();

    // TODO: do something more intelligenthere to reload only the template model
    if(_imageChanged)
      $window.location.reload();
  };

  this.hide = function(){
    $mdDialog.hide();
  };

  this.submit = function(){

    ctrl.current.externalResources = getTemplateInjections();

    ctrl.current.textTags.map(function(e){e;
      delete e["$$hashKey"];
      return e;
    });
    templatesService.submitChanges(_original, ctrl.current)
    .success(function(data, status, headers, config){
      ctrl.hide();
      $window.location.reload();
    })
    .error(function(a,b,c){
      "[Tapa Plugin] Error submitting template changes";
    });
    
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

  this.isAssetsEmpty = function(){
    return _templateAssets.length == 0;
  };

  this.getAssetsList = function(){
    return _templateAssets;
  };

  this.isImagesEmpty = function(){
    return _templateImages.length == 0;
  };

  this.getImagesList = function(){
    return _templateImages;
  };

  this.openImage = function(url){
    $window.open(url);
  };

  this.showUploadDialog = function(img, ev, fileInputElement) {
    console.log(fileInputElement);
  };

  this.uploadImage = function(file, img){
      if(typeof file === 'undefined')
        return;



      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.setParent(document.getElementById("popupContainer"));
      $scope.progressbar.setColor('#fff');
      $scope.progressbar.start();

      templatesService
      .uploadImage(ctrl.current.name, file, img.url)
      .then(function(data){
        $scope.progressbar.complete();
        img.updateRando();
        _imageChanged = true;
      });
  };



  /* ****************************************************************
      Private Functions
     **************************************************************** */

  function isEnabled(asset){
    var arr = ctrl.current.externalResources;
    for(var x = 0 ; x < arr.length ; x++ ){
      if(arr[x].url === asset)
        return true;
    }
    return false;
  }

  function getTemplateInjections(){

    var newArr = new Array();

    function getType(asset){
      return asset.substring(asset.lastIndexOf(".")+1);
    }

    function getElement(asset){
      return {  
         "type" : getType(asset),
         "context" : "mantle",            // Sorry, only mantle context for now
         "url" : asset
      };
    }

    for(var x = 0 ; x < _templateAssets.length ; x++ ){
      if(_templateAssets[x].enabled)
        newArr.push(getElement(_templateAssets[x].fileName));
    }

    return newArr;

  }



  /* ****************************************************************
      Init part
     **************************************************************** */

  templatesService.getJsCss(this.current.name, "jscss")
  .success(function(data){

    if( data.queryInfo.totalRows > 0 ){
        _templateAssets = data.resultset.map(function(elm){
          return {fileName : elm[0] , enabled : isEnabled(elm[0]) };
        });
    }

  })
  .error(function(){
    console.log("[Tapa Plugin] Error loading assets list");
  });

  templatesService.getImages(this.current.name, "img")
  .success(function(imgData){

    if( imgData.queryInfo.totalRows > 0 ){
        _templateImages = imgData.resultset.map(function(elm){
          var rando = new Date().YYYYMMDDHHMMSS();
          return {
            "srcUrl" : templatesService.getTemplatePath(ctrl.current.name)+elm[0],
            "url" : elm[0],
            "rando" : rando,
            getSrcUrl : function(){
              return this.srcUrl + "?rando="+this.rando
            },
            updateRando : function(){
              this.rando = new Date().YYYYMMDDHHMMSS();
            },
            id : rando
          };
        });
    }

  })
  .error(function(){
    console.log("[Tapa Plugin] Error loading images list");
  });



  templatesService.setImgUploadCallback(ctrl.uploadImage);






}




})();