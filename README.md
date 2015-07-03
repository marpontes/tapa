tapa
===

## What it does?

Tapa is a PUCLogin modifier that also delivers css/js injection to Mantle. And it does it in a minimally invasive fashion. The plugin installs itself and **only** patches your PUCLogin.jsp - keeping a backup of it.

## Why tapa?

Tapa uses [Pebble template engine](http://www.mitchellbosecke.com/pebble/home) to simplify your job while customizing Pentaho's login page.

And because it also injects js/css files to your Mantle context [in the best way possible](http://wiki.pentaho.com/display/ServerDoc2x/Developing+Plugins#DevelopingPlugins-DefiningExternalResources%28asof4.0%29) you can take advantage of this to make modifications on your mantle and/or deliver some js applications through Pentaho js APIs.

## How to install

```bash
$ cd pentaho-solutions/system
$ git clone https://github.com/marpontes/tapa.git tapa

```

## Using it

The installed templates are located into:
```
tapa/resources/templates/[template-name]/
```

Tapa delivers a Perspective for admin users where they can:
* Enable/disable the plugin - it toggles between your PUCLogin-backup and our PUCLogin;
* Choose which is the active template
* Enable/Disable Splash Screen - NYI

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

## Roadmap

Yes, this is a work in progress.

These are some future features:
* Upload images to replace templates images;
* Ability to change static texts on admin-ui;
* Ability to upload a new template;
* ...


