<%--
* This program is free software; you can redistribute it and/or modify it under the
* terms of the GNU Lesser General Public License, version 2.1 as published by the Free Software
* Foundation.
*
* You should have received a copy of the GNU Lesser General Public License along with this
* program; if not, you can obtain a copy at http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
* or from the Free Software Foundation, Inc.,
* 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
* See the GNU Lesser General Public License for more details.
*
* Copyright (c) 2002-2013 Pentaho Corporation..  All rights reserved.
--%>

<%@ taglib prefix='c' uri='http://java.sun.com/jstl/core'%>
<%@
    page language="java"
    import="org.springframework.security.web.savedrequest.SavedRequest,
            org.pentaho.platform.engine.core.system.PentahoSystem,
            org.pentaho.platform.util.messages.LocaleHelper,
            org.pentaho.platform.api.engine.IPentahoSession,
            org.pentaho.platform.api.engine.IPluginManager,
            org.pentaho.platform.web.jsp.messages.Messages,
            java.nio.charset.StandardCharsets,
            java.nio.file.Files,
            java.nio.file.Paths,
            java.util.List,
            java.util.ArrayList,
            java.util.StringTokenizer,
            org.apache.commons.lang.StringEscapeUtils,
            org.pentaho.platform.engine.core.system.PentahoSessionHolder,
            org.owasp.encoder.Encode,
            org.pentaho.platform.util.ServerTypeUtil,
            java.util.HashMap,
            java.util.Map,
            java.lang.reflect.Method"%>


<%!

/*  --------------------------------
    Servlet declarations
    -------------------------------- */


  // List of request URL strings to look for to send 401

  private List<String> send401RequestList;
  public final String SPRING_SECURITY_SAVED_REQUEST_KEY = "SPRING_SECURITY_SAVED_REQUEST";

  public void jspInit() {
    // super.jspInit();
    send401RequestList = new ArrayList<String>();
    String unauthList = getServletConfig().getInitParameter("send401List"); //$NON-NLS-1$
    if (unauthList == null) {
      send401RequestList.add("AdhocWebService"); //$NON-NLS-1$
    } else {
      StringTokenizer st = new StringTokenizer(unauthList, ","); //$NON-NLS-1$
      String requestStr;
      while (st.hasMoreElements()) {
        requestStr = st.nextToken();
        send401RequestList.add(requestStr.trim());
      }
    }
  }


%>
<%



/*  --------------------------------
    Important Variables
    -------------------------------- */
  response.setCharacterEncoding(LocaleHelper.getSystemEncoding());
  String path = request.getContextPath();

  IPentahoSession userSession = PentahoSessionHolder.getSession();
  // SPRING_SECURITY_SAVED_REQUEST_KEY contains the URL the user originally wanted before being redirected to the login page
  // if the requested url is in the list of URLs specified in the web.xml's init-param send401List,
  // then return a 401 status now and don't show a login page (401 means not authenticated)
  Object reqObj = request.getSession().getAttribute(SPRING_SECURITY_SAVED_REQUEST_KEY);
  String requestedURL = "";
  if (reqObj != null) {
    requestedURL = ((SavedRequest) reqObj).getRedirectUrl();

    String lookFor;
    for (int i=0; i<send401RequestList.size(); i++) {
      lookFor = send401RequestList.get(i);
      if ( requestedURL.indexOf(lookFor) >=0 ) {
        response.sendError(401);
        return;
      }
    }
  }


  boolean loggedIn = request.getRemoteUser() != null && request.getRemoteUser() != "";
  int year = (new java.util.Date()).getYear() + 1900;

  boolean showUsers = Boolean.parseBoolean(PentahoSystem.getSystemSetting("login-show-sample-users-hint", "true"));






/*  --------------------------------
    Mobile redirection
    -------------------------------- */

  String ua = request.getHeader("User-Agent").toLowerCase();

  if (!"desktop".equalsIgnoreCase(request.getParameter("mode"))) {

    if (ua.contains("ipad") || ua.contains("ipod") || ua.contains("iphone") || ua.contains("android") 
        || "mobile".equalsIgnoreCase(request.getParameter("mode"))) {

      IPluginManager pluginManager = PentahoSystem.get(IPluginManager.class, PentahoSessionHolder.getSession());
      List<String> pluginIds = pluginManager.getRegisteredPlugins();

      for (String id : pluginIds) {

        String mobileRedirect = (String)pluginManager.getPluginSetting(id, "mobile-redirect", null);
        if (mobileRedirect != null) {

          // we have a mobile redirect
          //Check for deep linking by fetching the name and startup-url values from URL query parameters
          String name = (String) request.getAttribute("name");
          String startupUrl = (String) request.getAttribute("startup-url");

          if (startupUrl != null && name != null){

            //Sanitize the values assigned
            mobileRedirect += "?name=" + Encode.forJavaScript(name) + "&startup-url=" + Encode.forJavaScript(startupUrl);

          }
  %>

  <script type="text/javascript">

    if(typeof window.top.PentahoMobile != "undefined"){
      window.top.location.reload();
    } else {
      var tag = document.createElement('META');
      tag.setAttribute('HTTP-EQUIV', 'refresh');
      tag.setAttribute('CONTENT', '0;URL=<%=mobileRedirect%>');
      document.getElementsByTagName('HEAD')[0].appendChild(tag);
    }

  </script>
</head>
<BODY>
<!-- this div is here for authentication detection (used by mobile, PIR, etc) -->
<div style="display:none">j_spring_security_check</div>
</BODY>
</HTML>
<%
          return;

        }
      }
    }
  }



/*  Hi code visitor,

    Up to this line, all the code, but some includes is kept untouched. Okay, just beautified.
    What we did was to take out the presentation (aka html) part to process it through a 
    templating engine called Pebble:

      - http://www.mitchellbosecke.com/pebble/home

*/





/*  --------------------------------
    Tapa Plugin : Variables
    -------------------------------- */

  IPluginManager plugMan = PentahoSystem.get(IPluginManager.class, PentahoSessionHolder.getSession());
  Object generatedTemplate = null;

  // ---- START - block to determine if another restart is needed

  String solutionPath = PentahoSystem.getApplicationContext().getSolutionRootPath() + "/system/tapa/static/shouldrestart";
  String shouldRestart;


  try{
    shouldRestart = new String(Files.readAllBytes(Paths.get(solutionPath)), StandardCharsets.UTF_8);
    shouldRestart = (shouldRestart != null && shouldRestart.startsWith("yes")) ? "yes" : "no";
  }catch(Exception e){
    shouldRestart = "error";
  }

  // ---- END - block to determine if another restart is needed

  Map<String, Object> tapaContext = new HashMap<String, Object>();

  tapaContext.put(  "TAPA_TITLE"         , Messages.getInstance().getString("UI.PUC.TITLE")  );
  tapaContext.put(  "TAPA_LOCALE"        , Encode.forHtmlAttribute(request.getLocale().toString())  );
  tapaContext.put(  "TAPA_LOGIN_TITLE"   , Messages.getInstance().getString("UI.PUC.LOGIN.TITLE")  );
  tapaContext.put(  "TAPA_USERNAME"      , Messages.getInstance().getString("UI.PUC.LOGIN.USERNAME")  );
  tapaContext.put(  "TAPA_PASSWORD"      , Messages.getInstance().getString("UI.PUC.LOGIN.PASSWORD")  );
  tapaContext.put(  "TAPA_LOGIN"         , Messages.getInstance().getString("UI.PUC.LOGIN.LOGIN")  );
  tapaContext.put(  "TAPA_EVAL_LOGIN"    , Messages.getInstance().getString("UI.PUC.LOGIN.EVAL_LOGIN")  );
  tapaContext.put(  "TAPA_ADMIN_USER"    , Messages.getInstance().getString("UI.PUC.LOGIN.ADMIN_USER")  );
  tapaContext.put(  "TAPA_BUSINESS_USER" , Messages.getInstance().getString("UI.PUC.LOGIN.BUSINESS_USER")  );
  tapaContext.put(  "TAPA_GO"            , Messages.getInstance().getString("UI.PUC.LOGIN.GO")  );
  tapaContext.put(  "TAPA_COPYRIGHT"     , Messages.getInstance().getString("UI.PUC.LOGIN.COPYRIGHT", String.valueOf(year))  );
  tapaContext.put(  "TAPA_ERROR_CAPTION" , Messages.getInstance().getString("UI.PUC.LOGIN.ERROR.CAPTION")  );
  tapaContext.put(  "TAPA_LOGIN_ERROR"   , Messages.getInstance().getString("UI.PUC.LOGIN.ERROR")  );
  tapaContext.put(  "TAPA_LOGIN_OK"      , Messages.getInstance().getString("UI.PUC.LOGIN.OK")  );
  tapaContext.put(  "TAPA_REQUESTED_URL" , Encode.forJavaScript(requestedURL)  );
  tapaContext.put(  "TAPA_SHOWUSERS"     , showUsers  );
  tapaContext.put(  "TAPA_LOGGEDIN"      , loggedIn  );
  tapaContext.put(  "TAPA_SHOULDRESTART" , shouldRestart  );


/*  --------------------------------
    Tapa Plugin : Template retrieval
    -------------------------------- */

  try{
    
    Object tapaFactory = plugMan.getBean("tapaTemplateFactory");
    Method templateGetter = tapaFactory.getClass().getMethod("getTemplate", Map.class);

    generatedTemplate = templateGetter.invoke(tapaFactory, tapaContext);

  }catch(Exception e){

    System.out.println("Tapa Plugin: Hey, sorry! There was a problem generating your template");
    e.printStackTrace();

    // TODO : have to make this more beautiful. Maybe failover to the original PUCLogin.jsp 

    generatedTemplate = new String(
       "Sorry. Hey, there was something wrong while rendering your brand new template."
      + " suggestion: make your login here and restore the original login page within Tapa Plugin<br /><br />"
      + "<form name=\"login\" id=\"login\" action=\"j_spring_security_check\" method=\"POST\">\n"
      + "<div class=\"row-fluid nowrap\">\n"
      + "  <div class=\"input-container\">\n"
      + "    <label>User Name:</label>\n"
      + "    <input id=\"j_username\" name=\"j_username\" type=\"text\" placeholder=\"\" autocomplete=\"off\">\n"
      + "  </div>\n"
      + "  <div class=\"input-container\">\n"
      + "    <label>Password:</label>\n"
      + "    <input id=\"j_password\" name=\"j_password\" type=\"password\" placeholder=\"\" autocomplete=\"off\">\n"
      + "  </div>\n"
      + "  <div class=\"input-container\">\n"
      + "    <label>&nbsp;</label>\n"
      + "    <button type=\"submit\" id=\"loginbtn\" class=\"btn\">Login</button>\n"
      + "    <input type=\"hidden\" name=\"locale\" value=\"en_US\">\n"
      + "  </div>\n"
      + "</div>\n"
      + "</form>" );

  }

%>
<%=generatedTemplate%>