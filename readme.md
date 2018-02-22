# cm-anvato

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This module is also exposed as a global variable in `dist/cmanvato.min.js`.

This JavaScript module is intended for use with this Methode tag:

    /PortalConfig/common/components/video/<version>/player.jpt

This module includes support for metrics and ads.

Requires ad tags version 3.8.0 or higher.

## Site Settings
### anvatoPlayer
Path to the desired version of `player.jpt` for your site. See description in the [Template Include](#template-include) section below for more detail.

### anvatoAccessKeyV3
Access key for a given site. This value is provided by the Video team.

### vast_cmsid
CMS id for a given site. This value is provided by the Ad Operations team.

### anvatoDFPTimeout
*[Optional]* Override for the 20 second pre-roll timeout. Value in seconds.

## Template Include
```xml
<!-- Default are autoplay off and not muted. -->
<p:include webObject="${vpxObject}" styleName="${portalContext.env.anvatoPlayer}" />
```
```xml
<!-- Autoplay and mute settings can be set manually. -->
<p:include webObject="${vpxObject}" styleName="${portalContext.env.anvatoPlayer}">
	<p:param name="autoplay" value="true" />
	<p:param name="muted" value="true" />
</p:include>
```
In this example `portalContext.env.anvatoPlayer` is an environment property that contains the full path to `player.jpt`. Using an environment property will allow your entire site to point at a single version of the player and will allow you to update an entire site to a new version should the need arise.
Here is an example entry from a site's `environments.properties` file:
```
anvatoPlayer = /PortalConfig/common/components/video/2.8.2/player.jpt
```

## JavaScript API

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

## Build Tools

Start by creating a file named `auth.json` in the root of this directory. This file
is not committed and has already been added to `.gitignore`. These credentials are used
when interacting with WebDAV.
```json
{
  "username": "dcobb",
  "password": "abc123"
}
```
You must be on the VPN to push to WebDAV.

### Creating a new version
Bump version ids in `package.json` as well as ***any source files***.
Remember to commit the changes afterward.
```
$ grunt version:major
$ grunt version:minor
$ grunt version:patch
```
### Pushing to Methode
Upload your src files to a remote environment. Will fail if your version already
exists remotely. In this case see the `grunt version` task.
```
$ grunt push:dev
$ grunt push:qa
$ grunt push:staging
$ grunt push:prod
```
### Update an existing version
**Danger Zone** Overwrite an existing version in a remote environment. This is
irreversable so be sure this is what you mean to do.
```
$ grunt push:dev --f
$ grunt push:dev --force
```
### Publishing a version
Publish the current version in a remote environment. This method of publishing is disabled in production.
```
$ grunt publish:dev
$ grunt publish:qa
$ grunt publish:staging
```
