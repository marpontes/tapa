tapa
===

**WARNING**: This is a development branch.

Previous versions of Pentaho (prior to 7.0) used Spring security V2.x and It was easy to use a `BeanFactoryPostProcessor` in order to inject rules and expose images and other files to non-authenticated users.

However, Pentaho 7.0 brought Spring security 4.x and a setter method of the `FilterChainProxy` wasn't present anymore.

## Workaround until we get things done
So until we don't find a workaround to make deploying tapa painless, here's the painful version of how to deploy:

**1. Clone Tapa**
```
cd pentaho-server/pentaho-solutions/system
git clone https://github.com/marpontes/tapa.git
cd tapa
git fetch
git checkout dev
```

**2. Modify your applicationContext-spring-security.xml**

* Open the file `system/applicationContext-spring-security.xml`
* Add the following before the closing `</beans>` tag:
```xml
<bean class="org.springframework.security.web.access.intercept.FilterSecurityInterceptor" id="filterInvocationInterceptorForTapa">
    <property name="authenticationManager" ref="authenticationManager"/>
    <property name="accessDecisionManager" ref="httpRequestAccessDecisionManager"/>
    <property name="securityMetadataSource">
      <sec:filter-security-metadata-source request-matcher="ciRegex" use-expressions="false">
        <sec:intercept-url access="Anonymous,Authenticated" pattern="\A/content/tapa/resources/templates/([\w\-\_]+)/assets/.*\Z"/>
        <sec:intercept-url access="Authenticated" pattern="\A/.*\Z"/>
      </sec:filter-security-metadata-source>
    </property>
  </bean>
```
* Now on the same file, find the `<bean>` with the `id="filterChainProxy"` and to the list of `<sec:filter-chain...` arguments, add to the beginning (1st item on list)
```xml
<sec:filter-chain pattern="/content/tapa/resources/templates/*/assets/**"                  filters="securityContextHolderAwareRequestFilterForWS,httpSessionPentahoSessionContextIntegrationFilter,httpSessionContextIntegrationFilter,basicProcessingFilter,requestParameterProcessingFilter,anonymousProcessingFilter,exceptionTranslationFilterForWS,filterInvocationInterceptorForTapa" />
```

**3. Restart Pentaho Server**