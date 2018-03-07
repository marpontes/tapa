tapa
===

## What it does?

Tapa is a PUCLogin modifier that also delivers css/js injection to Pentaho User Console. And it does it in a minimally invasive fashion. The plugin installs itself and **only** patches your `PUCLogin.jsp` and your `applicationContext-spring-security.xml` - keeping backups of both.

## Why tapa?

Tapa uses [Pebble template engine](http://www.mitchellbosecke.com/pebble/home) to simplify your job while customizing Pentaho's login page.

And because it also injects js/css files to your Mantle context [in the best way possible](http://wiki.pentaho.com/display/ServerDoc2x/Developing+Plugins#DevelopingPlugins-DefiningExternalResources%28asof4.0%29) you can take advantage of this to make modifications on your Pentaho User Console and/or deliver some js applications through Pentaho js APIs.

## How to install

The easy way
1. Open Marketplace on your Pentaho User Console
2. Find tapa and install it;
3. Restart your Pentaho Server 2x (yes, twice);

> If you have the Pentaho Server Enterprise, you need to first activate Marketplace on your server. To see how, open the [Marketplace page](http://www.pentaho.com/marketplace/) and click **"Find Marketplace"**.

If you prefer install the _hard_ way, you can clone it directly:

```bash
$ cd pentaho-solutions/system
$ git clone https://github.com/marpontes/tapa.git tapa
```

## Using it

The installed templates are located into:
```
tapa/resources/templates/[template-name]/
```

Tapa delivers the following features:

* Change Pentaho User Console Login page to a custom one;
* Tapa admin-ui perspective from the Pentaho User Console;
* Ability to open admin-ui in a new browser tab;
* Expose <TEMPLATE_ROOT>/assets/* to non-authenticated users.
* Enable and disable Tapa from the Tapa admin-ui;
* Switch the currently active template via admin-ui;
* Implement all the customizations without touching many bi-server files - we only patch PUCLogin.jsp - and it's reversible via UI;
* Inject js/css resources into puc using our admin user interface;
* Upload a Tapa template to the server;
* Download a Tapa template from the server;
* Preview a Tapa template from the admin-ui;
* Change template name from admin-ui;
* Developers can Insert text tags into templates so that admin users can change these texts from admin-ui;
* Developers have the ability to use server-side variables previously calculated into PUCLogin.jsp into their templates;
* Developers can use a variable that holds their template url - so that they keep their templates name-independent;
* Admin users can change the images of a template from the admin-ui;
* Example of external-resources that inserts a company logo on PUC header - image can be changed via admin-ui and feature can be disabled via admin-ui;
* Example of external-resources that changes the default User Console welcome page to a custom one - that is so far only customizable through editing the html file.

Each template has its own index.html that you can change - please see [Pebble ](http://www.mitchellbosecke.com/pebble/home) docs. If you see our PUCLogin.jsp you'll see we're providig all server-side variables to the template, so you're free to use them.

Place all your assets into your templates/[template-folder]/assets/ so that they're publicly visible - to non-authenticated users.

Every template has its own template-config.json in which you can specify some vars such as:

```json
{  
   "thumbnailImageUrl" : "assets/img/nagem-screenshot.jpg",
   "externalResources" : [  
      {  
         "type" : "js",
         "context" : "mantle",
         "url" : "assets/js/mantle-context.js"
      },
      {  
         "type" : "css",
         "context" : "mantle",
         "url" : "assets/css/mantle-context.css"
      }
   ],
   "textTags" : [  
      {  
         "tag" : "STATIC_RIGHT_HEADER_TEXT",
         "value" : "Business Intelligence Portal"
      },
      {  
         "tag" : "STATIC_LOGIN_TEXT",
         "value" : "Please enter your credentials"
      },
      {  
         "tag" : "STATIC_USERNAME_PLACEHOLDER",
         "value" : "Username"
      },
      {  
         "tag" : "STATIC_PASSWORD_PLACEHOLDER",
         "value" : "Password"
      },
      {  
         "tag" : "STATIC_BASED_TEXT",
         "value" : "Based on"
      },
      {  
         "tag" : "STATIC_BROUGHT_BY_TEXT",
         "value" : "Brought to you by"
      }
   ]
}
```

As you can see, there are STATIC_ text variables that you can use on your template as well as static resources to be injected.

# TODO:

The documentation is sparse - there are docs on tapa's upload template dialog; on tapa's splash screen and on this wiki. We need to put it all together in a Wiki on this repository.

# Architecture diagram

![Architecture](https://raw.githubusercontent.com/marpontes/tapa/master/static/marketplace/img/tapa-arch.png)

