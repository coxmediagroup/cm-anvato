# cm-anvato
*v3.0.1*

[![Dependencies](https://circleci.com/gh/coxmediagroup/cm-anvato.png?style=shield&circle-token=:circle-token)](./package.json)
[![Dependencies](https://img.shields.io/david/coxmediagroup/cm-anvato.svg)](./package.json)
[![Dependencies](https://img.shields.io/david/dev/coxmediagroup/cm-anvato.svg)](./package.json)

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This module is also exposed as global variable `cmanvato` in `dist/cmanvato.min.js`.

This JavaScript module is intended for use with this Methode tag:

    /PortalConfig/common/video/<version>/player.jpt

If you building your own playlist you may optionally override the video id set:

    <p:include url="/PortalConfig/common/video/<version>/player.jpt">
        <p:param name="videoIdOverride" value="234455,3340289" />
    </p:include>

This module includes support for metrics and ads.

Requires ad tags version 3.8.0 or higher.

This project adheres to [Semantic Versioning](http://semver.org/).
All notable changes will be documented in [the changelog](https://github.com/coxmediagroup/cm-anvato/blob/master/changelog.md).

### [See this project's wiki for more information](https://github.com/coxmediagroup/cm-anvato/wiki)

## JavaScript SDK

### anvato.get([id])
Safely fetch a player regardless of Anvato load state. Requests for players that don't exist yet are cached until the player exists. Returns a Promise that provides the player instance. See [Anvato's documentation](https://dev.anvato.net/api/player#reference-guide) for more information on the player SDK.
```js
var anvato = require('cm-anvato');
anvato.get('p0').then(function (player) {
    player.on('METADATA_LOADED', function () {});
});
// Calling without a player id will return all players.
anvato.get().then(function (players) {
    players.forEach(function (player) {});
});
```
### anvato.set(name, value)
Update the `anvp.common.config` object.
```js
anvato.set('recom', false);
```
### anvato.setup()
Begin loading of all players in the page.
```js
anvato.setup();
```
### anvato.on(name, callback)
Hook into the global event handler for all Anvato players in the page. See [Anvato's documentation](https://dev.anvato.net/api/player#api-events) for more information about player events.
```js
anvato.on('METADATA_LOADED', function (event) {
    var playerId = event.sender;
});
```
### anvato.loadPlayers()
Load additional players separate from the normal in page players. This is an option for players loaded through events such as ajax or clicks.
```js
anvato.loadPlayers();
```
### anvato.pauseAll()
Pauses all players in the page.
```js
anvato.pauseAll();
```

## Contributing
1. Install grunt `$ npm -g i grunt-cli`
1. Install the project tools `$ npm i`
1. Make your code changes.
1. Run `$ grunt`.
1. Update the `changelog.md` to describe your changes.
1. Commit your changes.
1. Run `$ grunt version:<major|minor|patch> --buildtask=default`. This repository uses strict [semver](http://semver.org) - meaning:
   * **major** *ONLY* if you introduced a breaking change to an existing public method.
   * **minor** If you added a new public method or enhanced an existing method in a non-breaking way.
   * **patch** Internal (non-public) changes - bug fixes, performance improvements, etc.
1. Push to origin with tags. Ex) `$ git push origin my-branch --tags`

### Building and Publishing
If your changes include template changes, you will want to build your new version to Methode. This project uses the [methode-publishing](https://github.com/coxmediagroup/methode-publishing#methode-publishing-tools) toolkit for pushing and publishing to WebDav.
