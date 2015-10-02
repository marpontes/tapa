(function(){

  var app = angular.module('splashScreenModule',['overlayModule','sideMenuModule']);

  app.directive('splashScreen',['overlayService','configService',function(overlayService,configService){
    return {
      restrict : 'E',
      templateUrl : 'app/components/splash-screen/splash-screen.html',
      controllerAs : 'splashCtrl',

      controller : function($scope){

        this.splashItems = [
          {
            title : "Customize your login page",
            img   : "assets/img/login_monitor.png",
            moreTemplate : "app/components/splash-screen/more-info-login.html",
            itemsList : [
              "Choose between existing templates;",
              "Upload your own images;",
              "Customize texts;",
              "Upload/Download your own templates;",
              "Have less pain on migrations."
            ]
          },
          {
            title : "Customize your Pentaho BI-Server",
            img   : "assets/img/custom_puc.png",
            moreTemplate : "app/components/splash-screen/more-info-customize.html",
            itemsList : [
              "Insert your Company Logo;",
              "Replace Pentaho's welcome page;",
              "Inject CSS / Javascript into Mantle;",
              "Do it without hacking any Pentaho Files;",
              "Develop your own package;"
            ]
          }
        ];

        ctrl = this;
        this.varShowSplash = false;

        this.disposeSplash = function(){
          ctrl.varShowSplash = false;
          overlayService.hideOverlay();
        };

        this.showSplash = function(){
          if(configService.getShowSplash())
            ctrl.showSplashAlways();
        };

        this.showSplashAlways = function(){
            overlayService.showOverlay(ctrl.disposeSplash);
            ctrl.varShowSplash = true;
        };

        configService.registerSplashObserverCallback( ctrl.showSplash );
        configService.registerSplashCallback( ctrl.showSplashAlways );


      }

    };
  }]);

})();