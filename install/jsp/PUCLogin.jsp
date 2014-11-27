<%@ taglib prefix='c' uri='http://java.sun.com/jstl/core'%>
<%@
    page language="java"
    import="org.springframework.security.ui.AbstractProcessingFilter,
            org.springframework.security.ui.webapp.AuthenticationProcessingFilter,
            org.springframework.security.ui.savedrequest.SavedRequest,
            org.springframework.security.AuthenticationException,
            org.pentaho.platform.uifoundation.component.HtmlComponent,
            org.pentaho.platform.engine.core.system.PentahoSystem,
            org.pentaho.platform.util.messages.LocaleHelper,
            org.pentaho.platform.api.engine.IPentahoSession,
            org.pentaho.platform.web.http.WebTemplateHelper,
            org.pentaho.platform.api.engine.IUITemplater,
      org.pentaho.platform.api.engine.IPluginManager,
            org.pentaho.platform.web.jsp.messages.Messages,
            java.util.List,
            java.util.ArrayList,
            java.util.StringTokenizer,
            org.apache.commons.lang.StringEscapeUtils,
            org.pentaho.platform.engine.core.system.PentahoSessionHolder,
            org.owasp.esapi.ESAPI,
            org.pentaho.platform.util.ServerTypeUtil"%>
<%! 


  private List<String> send401RequestList;

  public void jspInit() {

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
  response.setCharacterEncoding(LocaleHelper.getSystemEncoding());
  String path = request.getContextPath();

  IPentahoSession userSession = PentahoSessionHolder.getSession();
   
  // SPRING_SECURITY_SAVED_REQUEST_KEY contains the URL the user originally wanted before being redirected to the login page
  // if the requested url is in the list of URLs specified in the web.xml's init-param send401List,
  // then return a 401 status now and don't show a login page (401 means not authenticated)
   
  Object reqObj = request.getSession().getAttribute(AbstractProcessingFilter.SPRING_SECURITY_SAVED_REQUEST_KEY);
  String requestedURL = "";
  if (reqObj != null) {
    requestedURL = ((SavedRequest) reqObj).getFullRequestUrl();

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
%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" class="bootstrap">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title><%=Messages.getInstance().getString("UI.PUC.TITLE")%></title>

  <%
    String ua = request.getHeader("User-Agent").toLowerCase();
    if (!"desktop".equalsIgnoreCase(request.getParameter("mode"))) {
      if (ua.contains("ipad") || ua.contains("ipod") || ua.contains("iphone") || ua.contains("android") || "mobile".equalsIgnoreCase(request.getParameter("mode"))) {
        IPluginManager pluginManager = PentahoSystem.get(IPluginManager.class, PentahoSessionHolder.getSession());
        List<String> pluginIds = pluginManager.getRegisteredPlugins();
        for (String id : pluginIds) {
          String mobileRedirect = (String)pluginManager.getPluginSetting(id, "mobile-redirect", null);
          if (mobileRedirect != null) {
            // we have a mobile redirect
  %>
  <script type="text/javascript">
    //Get URL parameters
    var requestedURL = '<%=requestedURL%>';
    var getParams = requestedURL.split("?");
    var params = '';

    //If there are no GET parameters on the URL leave the params object empty so that the check for
    //a startup report setting is conducted
    if (getParams.length > 1) {
      params = '?' + getParams[1];
    }
    if(typeof window.top.PentahoMobile != "undefined"){
      window.top.location.reload();
    } else {
      document.write('<META HTTP-EQUIV="refresh" CONTENT="0;URL=<%=mobileRedirect%>' + params + '">');
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
%>

<meta name="gwt:property" content="locale=<%=ESAPI.encoder().encodeForHTMLAttribute(request.getLocale().toString())%>">

<script src="/pentaho-style/tapa/chesf/js/jquery-1.11.1.min.js"></script>    
<link rel="stylesheet" href="/pentaho-style/tapa/_bootstrap/css/bootstrap.min.css">
<script src="/pentaho-style/tapa/_bootstrap/js/bootstrap.min.js"></script>
<link href='/pentaho-style/tapa/chesf/css/oxygen.css' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="/pentaho-style/tapa/chesf/css/styles.css">
    
</head>

<body>
<div id="fullscreen_bg" class="fullscreen_bg"/>
<div class="header">
    Portal de Business Intelligence
</div>
<div class="container">
    <div class="form-wrapper">
        <form class="form-signin" action="j_spring_security_check" method="post">
            <h3><span class="glyphicon glyphicon-lock"></span> Log in</h3>
            <hr>
            Por favor informe suas credenciais
            <input name="j_username" autocomplete="off" type="text" class="form-control" placeholder="Usu&aacute;rio" required="" autofocus="">
            <input name="j_password" type="password" class="form-control" placeholder="Senha" required="">
            <button class="btn btn-lg btn-primary btn-block" type="submit">
                Login
            </button>
        </form>
    </div>

</div>
<div class="footer gradient">
    <div class="pull-left">
        Baseado em
    </div>
    <div class="pull-right">
        Trazido at&eacute; voc&ecirc; por
    </div>
    <hr>
    <div class="clearfix"></div>
    <div class="company-logo pull-left logo-pentaho"></div>
    <div class="company-logo pull-right logo-oncase"></div>
</div>
</body>
