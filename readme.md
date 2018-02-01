# cm-anvato

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This module is also exposed as a global variable in `dist/cmanvato.min.js`.

This JavaScript module is intended for use with this Methode tag:

    /PortalConfig/common/components/video/player.jpt

This module includes support for metrics and ads.

Requires ad tags version 3.8.0 or higher.

### anvato.set(name, value)
Update the `anvp.common.config` object.
```js
var anvato = require('cm-anvato');
anvato.set('recom', false);
```
### anvato.setup()
Begin loading of all players in the page.
```js
anvato.setup();
```
### anvato.loadPlayers()
Load additional players separate from the normal in page players. This
is an option for players loaded through events such as ajax or clicks.
```js
anvato.loadPlayers();
```
### anvato.pauseAll()
Pauses all players in the page.
```js
anvato.pauseAll();
```
### anvato.on|one(name, callback)
Listen to a system event.
```js
anvato.on('METADATA_LOADED', function (event) {});
anvato.one('FIRST_FRAME_READY', function (event) {});
```
### anvato.off([name])
Stop listening to a system event.
```js
anvato.off('METADATA_LOADED');
anvato.off();
```

## Debug Controls
Exposed are a set of manual overrides to debug a player in your browser.
```
page.com?anvato=setting|setting-value
```

#### ?anvato=stage
Use the staging player instead of the production player.

#### ?anvato=autoplay-&lt;true|false&gt;
Force autoplay on or off for all players.

#### ?anvato=recom-&lt;true|false&gt;
Force recommended list on or off for all players.

#### ?anvato=mute-&lt;true|false&gt;
Force player mute on or off for all players.

#### ?anvato=volume-&lt;value&gt;
Override the default volume level for all players.

#### ?anvato=noads
Disable pre-roll for all players.

#### ?anvato=uid-&lt;value&gt;
Tag your NewRelic actions with a custom id.

#### ?anvato=startTimeout-&lt;value&gt;
Override `startTimeout` player setting.

#### ?anvato=vastLoadTimeout-&lt;value&gt;
Override `vastLoadTimeout` player setting.

#### ?anvato=loadVideoTimeout-&lt;value&gt;
Override `loadVideoTimeout` player setting.

## Contributing
1. Setup the tools `$ npm i`
1. Make your code changes.
1. Run `$ grunt`.
1. Commit your changes.
1. Run `$ npm version <major|minor|patch>`. This repository uses strict [semver](http://semver.org) - meaning:
   * **major** *ONLY* if you introduced a breaking change to an existing public method.
   * **minor** If you added a new public method or enhanced an existing method in a non-breaking way.
   * **patch** Internal (non-public) changes - bug fixes, performance improvements, etc.
1. Push to origin with tags. Ex) `$ git push origin my-branch --tags`
