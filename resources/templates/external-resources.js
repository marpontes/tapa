/*
	This is the only file included at plugin.xml
	as a js reference to mantle context.
*/

(function(){

	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function(searchString, position) {
	    position = position || 0;
	    return this.indexOf(searchString, position) === position;
	  };
	}

	var templatesPath = CONTEXT_PATH+"content/tapa/resources/templates";
	var jsPath = "";

	if(typeof $ === "undefined"){
		require(['cdf/lib/jquery'],function($){
			loadTapaResources($);
		});
	}else{
		loadTapaResources($);
	}


	function loadTapaResources($){


		/* 	@marpontes - only jquery 1.4.4 available, so.. old style.

			Reads config.json to determine the current template name
			and loads template-config.json within to inject the 
			"externalResources" when on mantle context.
		*/
		$.getJSON( CONTEXT_PATH+"plugin/tapa/api/getconfig",  function(config){
			
			if (config["pluginEnabled"] !== true)
				return;

			var template = config.currentTemplate;
			var templatePath = templatesPath + "/" + template;
			jsPath =  templatePath + "/template-config.json";

			console.log("[TapaPlugin] Current Template is: "+template);
			console.log("[TapaPlugin] Loading "+ jsPath);

			$.getJSON(jsPath,function(pconf){

				if(pconf===null || undefined === pconf.externalResources){
					console.log("[TapaPlugin] No externalResources at "+ jsPath);
					return;
				}

				var er = pconf.externalResources;

				for(index in er){
					var url = er[index].url;
					var type = er[index].type;

					appendResource(templatePath+"/"+url,type);
				}
			});

		});

	} 


	/*	appends css or js to the <head> tag.
	*/
	function appendResource(url,type){
		if(type==="css"){
			$("<link rel='stylesheet' type='text/css' href='"+ url +"?context=mantle'/>")
			.appendTo("head");
			console.log("[TapaPlugin] Loaded css "+url);
		}else if(type==="js"){
			$("<script type='text/javascript' src='"+ url +"'></scr"+"ipt>")
			.appendTo("head");
			console.log("[TapaPlugin] Loaded js "+url);
		}else{
			console.log("[TapaPlugin] There might be something wrong with your template config. "+
				"But no harm done");
		}
		
	}


})();

