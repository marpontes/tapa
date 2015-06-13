/*
	This is the only file included at plugin.xml
	as a js reference to mantle context.
*/

(function(){

	var templatesPath = "content/tapa/resources/templates";
	var jsPath = "";

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

	/*	appends css or js to the <head> tag.
	*/
	function appendResource(url,type){
		if(type==="css"){
			$("<link rel='stylesheet' type='text/css' href='"+ url +"?context=mantle'/>")
			.appendTo("head");
		}else if(type==="js"){
			$("<script type='text/javascript' src='"+ url +"'></scr"+"ipt>")
			.appendTo("head");
		}else{
			console.log("[TapaPlugin] There might be something wrong with your template config. "+
				"But no harm done");
		}
		
	}


})();

