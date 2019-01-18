```

    Starter 2019


```

# Features

* Webpack 3
* Babel 
* ES6 ready
* Autoprefixer
* Stylus
* Targetable browser
* Easy configurable devServer
* Network sharing
* Hot reload
* WebGL shaders import


# Requirement :

```
npm
Webpack 3
```

Node version recommended :

```
Node : v7.4.0
npm : 4.0.5
```

## Running Dev Environement

Dev are in the ```/src``` repository
The ```/build``` folder can be entirely rebuild from the src folder, so DO NOT place any needed assets in the build folder ! ONLY in the ```/src``` directory, they will be copied in the build during export.

Installation of Webpack : ```npm i -g webpack webpack-dev-server```

##To start :

1. Clone the project & ```cd path/to/the/clonned/repository```
2. Run ```npm install```
3. Run ```npm start```
4. Go to ```localhost:3000``` on your browser.


## Config as you wish

All the avaliable options are stored in the ```settings.config.js``` in the root of your project

### You can play with those options : 

```
browsersTarget: ["last 2 versions"],        // Target browser for autocomplete and Babel config, full list here : https://github.com/ai/browserslist
port: 3000,                                 // the listening port of your devServer
https: false,                               // Need https ?
sourceMap: true,                            // SourceMap options for styles
shared: true,                               // Visible on your local network ?
inline: true,                               // inline ou iframe reloading
proxy: {                                    // setup proxy paths
    '/api': {
        target: 'https://other-server.example.com',
        secure: false
    }
}
```

## Stylus import 

Stylus will find automaticly all your ```.styl``` files, just re-run the server !
( all files starting with ``` _yourFile.styl ``` will be ignored )

## To build :

Run ```npm run build```
