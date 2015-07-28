Electron menus
============

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Add native menu items to renderer-side projects from the browser-side.

## Installation

````shell
npm install --save electron-menus
````

## Usage

````js

var menus = require('electron-menus')

menus.set(__dirname + '/index.html')
````

##### `set`

*.set(pathToIndexFile[, menuDefinition][, settings])*

Takes a `pathToIndexFile`, an optional `menuDefinition` to use, if not provided will default to [`menus/default.js`](menus/default.js) (see that file and [Electron menu documentation](https://github.com/atom/electron/blob/master/docs/api/menu.md) for more on what that array should look like) and an optional `settings` argument with the following defaults:

````js
{
  id: 'ELECTRON-menus' // The id of the script tag to inject the menu definition into,
  replace: false // If a script tag of the above id already exists, should it replace its contents or leave it alones
}
````

## Reasoning

Loading a flat file web app into Electron is quite easy, you would either hardcode those files, or, better yet, include that project as a module and point your `window.loadUrl` method at it.

The problem is that web app knows nothing about the native desktop context it is now in. And because basic elements like menu items, which enable Copy and Paste, must be defined on [the Renderer side](https://github.com/ilyavorobiev/atom-docs/blob/master/atom-shell/Architecture.md), your web app will feel powerless in its new environment. 

You might not want to hardcode the [required menu JavaScript](https://github.com/atom/electron/blob/master/docs/api/menu.md) into your web app, though if, for instance, you're using that code in multiple contexts and don't want to disable certain blocks when running in a browser versus Electron.

This module lets you inject the necessary JavaScript into the web app's `index.html` file.
