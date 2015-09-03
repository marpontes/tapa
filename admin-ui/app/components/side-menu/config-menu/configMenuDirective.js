(function(){

  var app = angular.module('sideMenuModule');

  app.directive('configMenu',['configService','$mdDialog','$timeout',
    function(configService,$mdDialog,$timeout){
    return {
      restrict : 'E',
      templateUrl : 'app/components/side-menu/config-menu/config-menu.html',
      controllerAs : 'configCtrl',

      controller : function($scope){

        var configCtrl = this;          // var to be passed to callback functions

        this.showSplashScreen = false;  // Config variable to be changed on server
        this.pluginEnabled = false;     // Config variable to be changed on server

        this.errorLoading = false;      // flag to control visibility of err msg
        this.dataLoaded = false;        // flag to control visibility of controls
  
        this.enablePluginSwitch = false; // Flag to enable/disable UI switch control 
        this.enableSplashSwitch = false; // Flag to enable/disable UI switch control 

        this.alertMessage = '';

        this.showAlert = function(msg){
          this.alertMessage = msg;
          this.alertVisible = true;
          $timeout(function(){
            configCtrl.alertMessage = '';
          },3000);
        };

        this.loadConfigControls = function(){

          return configService.getConfig()
          .success(function(data, status, headers, config){

            if( data["pluginEnabled"]==true || 
                data["pluginEnabled"]==false ) {
              configCtrl.pluginEnabled = data["pluginEnabled"];
              configCtrl.showSplashScreen = data["showSplashScreen"];
              configCtrl.dataLoaded = true;
              configCtrl.errorLoading = false;
              configCtrl.enablePluginSwitch = true;
              configCtrl.enableSplashSwitch = true;
            }
          })
          .error(function(data, status, headers, config) {
              configCtrl.dataLoaded = false;
              configCtrl.errorLoading = true;
          });


        };

        this.toggleShowSplashScreen = function(ev) {
          configCtrl.enableSplashSwitch = false;

          configService.setSplashScreen(this.showSplashScreen)
          .success(function(){
            configCtrl.loadConfigControls();
          })
          .error(function(){
            configCtrl.showAlert("Error toggling Splash Screen setting.");
            configCtrl.enableSplashSwitch = true;
            configCtrl.showSplashScreen = !configCtrl.showSplashScreen
          });
        }

        this.toggleEnablePlugin = function(ev) {

          configCtrl.enablePluginSwitch = false;
          
          if(!this.pluginEnabled){

            var confirm = $mdDialog.confirm()
              .parent(angular.element(document.body))
              .title('Would you like to disable Tapa Plugin?')
              .content("If you disable, we will replace your Tapa-Based PUCLogin for the backup we've made when we installed the plugin.")
              .ariaLabel('Lucky day')
              .ok('Yes, disable!')
              .cancel('Cancel')
              .targetEvent(ev);
            // When ok clicked
            $mdDialog.show(confirm).then(function() {
              // Call disablePlugin
              configService.disablePlugin()
              // When server answers successfully
              .success(function(){
                // Load controls again
                configCtrl.loadConfigControls();
              })
              // If error disabling plugin, enable switch
              .error(function(){
                configCtrl.enablePluginSwitch = true;
              });
            }, function() {
              configCtrl.showAlert("Nothing changed.");
              configCtrl.pluginEnabled = true;
              configCtrl.enablePluginSwitch = true;
            });

          }else{

            var confirm = $mdDialog.confirm()
              .parent(angular.element(document.body))
              .title('Would you like to enable Tapa Plugin?')
              .content("By enabling our plugin, we'll patch your Login page keeping a backup of it.")
              .ariaLabel('Lucky day')
              .ok('Yes, gimme Tapa!')
              .cancel('Cancel')
              .targetEvent(ev);
            // When ok clicked
            $mdDialog.show(confirm).then(function() {
              // Call enablePlugin
              configService.enablePlugin()
              // When server answers successfully
              .success(function(){
                // Load controls again
                configCtrl.loadConfigControls();
              })
              // If error disabling plugin, enable switch
              .error(function(){
                configCtrl.enablePluginSwitch = true;
              });
            }, function() {
              configCtrl.pluginEnabled = false;
              configCtrl.enablePluginSwitch = true;
            });

          }

        };

      }

    };
  }]);

})();