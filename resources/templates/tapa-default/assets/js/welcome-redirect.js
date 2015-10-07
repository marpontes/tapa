
if(location.pathname.startsWith(CONTEXT_PATH+"mantle/home")) {

	$(document).ready(function(){
		var elm = $(".welcome-frame"),
			url = CONTEXT_PATH + 'content/tapa/resources/templates/tapa-default/welcome.html';

		elm.attr("src",url);

	});	


}