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
* Now on the same file, find the `<bean>` with the `id="filterChainProxy"` and
    - Duplicate the line with the pattern `pattern="/**"`
    ```xml
    <sec:filter-chain pattern="/**" filters="securi..." />
    <sec:filter-chain pattern="/**" filters="securi..." />
    ```
    - On the first dupe line, change the pattern for `/content/tapa/resources/templates/*/assets/**`
    ```xml
    <sec:filter-chain pattern="/content/tapa/resources/templates/*/assets/**" filters="securi..." />
    <sec:filter-chain pattern="/**" filters="securi..." />
    ```
    - Again, on this line you've generated, replace the last item on the list `filters=` from `filterInvocationInterceptor` to``filterInvocationInterceptorForTapa` - be careful not to add white spaces
    ```xml
    <sec:filter-chain pattern="/content/tapa/resources/templates/*/assets/**" filters="...,filterInvocationInterceptorForTapa" />
    <sec:filter-chain pattern="/**" filters="...,filterInvocationInterceptor" />
    ```

**3. Restart Pentaho Server**