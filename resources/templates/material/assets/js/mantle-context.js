/*
	Appends a div to PUC header where we'll place our logo
	---
	Gotta check context (path) because we're on global scope
 */


if(  location.pathname.startsWith(CONTEXT_PATH+"Home")  ) {

	$("#pucHeader").append("<div id=\"tapaLogo\"></div>");

}
