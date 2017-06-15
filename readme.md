# cm-anvato

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This JavaScript module is intended for use with these Methode tags:

    /PortalConfig/np-common/components/video/anvato-conf.jpt
    /PortalConfig/np-common/components/video/player.jpt

This module includes support for metrics and ads.

Requires ad tags version 3.8.0.

### anvato.set(name, value)
```js
var anvato = require('cm-anvato');
anvato.set('recom', false);
```
### anvato.setup()
```js
anvato.setup();
```
### anvato.pauseAll()
```js
anvato.pauseAll();
```
### anvato.on|one(name, callback)
```js
anvato.on('METADATA_LOADED', function (event) {});
anvato.one('FIRST_FRAME_READY', function (event) {});
```
### anvato.off([name])
```js
anvato.off('METADATA_LOADED');
anvato.off();
```

## Contributing

1. Make and commit your changes.
2. Run `$ npm version <major|minor|patch>`. This repository uses strict [semver](http://semver.org) - meaning:
   * **major** *ONLY* if you introduced a breaking change to an existing public method.
   * **minor** If you added a new public method or enhanced an existing method in a non-breaking way.
   * **patch** Internal (non-public) changes - bug fixes, performance improvements, etc.
3. Push to origin with tags. Ex) `$ git push origin my-branch --tags`
