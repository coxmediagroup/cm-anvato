# cm-anvato

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This JavaScript module is intended for use with these Methode tags:

    /PortalConfig/np-common/components/video/anvato-conf.jpt
    /PortalConfig/np-common/components/video/player.jpt

This module includes support for metrics and ads.

Requires ad tags version 3.8.0.

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

## Contributing

1. Make and commit your changes.
2. Run `$ npm version <major|minor|patch>`. This repository uses strict [semver](http://semver.org) - meaning:
   * **major** *ONLY* if you introduced a breaking change to an existing public method.
   * **minor** If you added a new public method or enhanced an existing method in a non-breaking way.
   * **patch** Internal (non-public) changes - bug fixes, performance improvements, etc.
3. Push to origin with tags. Ex) `$ git push origin my-branch --tags`
