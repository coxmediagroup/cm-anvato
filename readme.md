# cm-anvato
*2.12.41*

Single-point install for the Anvato video player.

    npm i coxmediagroup/cm-anvato --save

This module is also exposed as global variable `cmanvato` in `dist/cmanvato.min.js`.

This JavaScript module is intended for use with this Methode tag:

    /PortalConfig/common/video/<version>/player.jpt

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
In this example `portalContext.env.anvatoPlayer` is an environment property that contains the full path to `player.jpt`. Using an environment property will allow your entire site to point at a single version of the player and will allow you to update an entire site to a new version should the need arise.
Here is an example entry from a site's `environments.properties` file:
```
anvatoPlayer = /PortalConfig/common/video/2.12.41/player.jpt
```
### Single Video Player
```xml
<p:include webObject="${vpxObject}" styleName="${portalContext.env.anvatoPlayer}">
    <p:param name="autoplay" value="true" />
    <p:param name="muted" value="true" />
</p:include>
```
The optional settings `autoplay` and `muted` default to `false`, but can be overwritten manually.

### Playlist Player
```xml
<p:include url="${portalContext.env.anvatoPlayer}">
    <p:param name="playlist" value="${vpxList}" />
    <p:param name="limit" value="10" />
</p:include>
```
The `playlist` setting is a `<p:list>` of vpx objects. Unfortunately Methode does not allow lists to be used as `currentObject` and so must be passed in using the `<p:param>` tag. The optional `limit` setting defaults to `10` is the maximum number of videos to include from your list - starting at index 0. The `autoplay` and `muted` settings default to `false` and work as expected for playlists.

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

### Building and Publishing
If your changes include template changes, you will want to build your new version to Methode. This project uses the [methode-publishing](https://github.com/coxmediagroup/methode-publishing#methode-publishing-tools) toolkit for pushing and publishing to WebDav.
