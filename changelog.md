# Change Log for CMG Anvato Integration
All notable changes to the repo will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
For information on Anvato Player changes, see their [changelog](https://dev.anvato.net/api/player#release-notes).

## Version 3

#### [3.1.8]
- Update player autoplay status in analytics if the browser blocks it

#### [3.1.7]
- Fixed the comma issue that happens when concatenating null with the topics array

#### [3.1.6]
- Update keyValues to separate video tags/categories from the page topics in the custom parameters

#### [3.1.5]
- Update Comscore configuration with the new CMG client ID

#### [3.1.4]
- Allow the AJC Chartbeat ID to work in lower environments for testing

#### [3.1.3]
- Avoid overwriting an existing Chartbeat configuration on the page

#### [3.1.2]
- Use separate Chartbeat ID for AJC

#### [3.1.1]
- Ensure the DFP client side can be built before assigning it in the beforeVideoLoad binding

#### [3.1.0]
- Allow for individual player initial plugin configs
- Modify and return the initial config in the beforeVideoLoad binding
- Updated the common comScore plugin to use the latest script

#### [3.0.1]
- Ensure videoPlayerLoad action fires only once per session per video player

#### [3.0.0]
- Added the skip-ad and 10-sec checkpoint events

## Version 2

#### [2.21.1]
- Changed player.jpt to include call to videoAdTargetingUrl customtag

#### [2.19.3]
- Fixes to player events/DDO actions:
  -- fire videoStart before pre-roll ad, if any
  -- fire videoPlayerLoad once per session per player
  -- round videoSecondsViewed to integer

#### [2.19.2]
- Added player events for DDO actions (ad start/complete; video load, pause, playback percentiles)

#### [2.19.1]
- Changed the way moat is optional by using the site environment variable directly

#### [2.19.0]
- Made moat optional

#### [2.18.3]
- Allow custom video id set to be passed into Methode include `videoIdOverride`

#### [2.18.2]
- Asset rebuild to fix version number in logs.

#### [2.18.1]
- Force players to use VMAP with the `&ad_rule=1` VAST parameter.

#### [2.18.0]
- Added moat plugin to common config

#### [2.17.1]
- Added player-level adunit override as `data-adunit="...."`.

#### [2.16.4]
- Fixed defect where get() would return only latest players. Calling get() should return all players no matter when added.

#### [2.16.3]
- Asset rebuild to fix version number in logs.

#### [2.16.2]
- Retain existing plugin settings on the `anvp.common.config.plugins` object. Use provided values as defaults and shallow merge the plugins objects.
- Fixed bad nonlinear ad overlay style.
- Added changelog.

#### [2.16.1]
- Add support for data-anv- boolean values.

#### [2.16.0]
- Retain any existing player container id values.

#### [2.15.0]
- Add support for nonlinear ad banner overlays.
- Added circleci integration.

#### [2.14.0]
- New html element configuration data-anv-***. See the [wiki](https://github.com/coxmediagroup/cm-anvato/wiki/Non-Shared-Player-Configurations) for more information.
- Removed DDO metrics workaround for known Anvato player defect where successive async methods would not be honored. Anvato has fixed the defect on their end.

#### [2.13.0]
- New html element configurations for autoadvance and recommended.

#### [2.12.42]
- New built task to automatically bump source files per new version.
- Update ad logs to display version numbers of anvato player and cm-anvato as well as player id to bound each log entry.

#### [2.11.2]
- Rename player() to get().

#### [2.11.1]
- New method player() to safely fetch a player regardless of Anvato API load state. See the [readme](https://github.com/coxmediagroup/cm-anvato#anvatogetid) for more information.

#### [2.10.2]
- Removed unused Chartbeat callbacks.

#### [2.10.1]
- Update methode tag to support video playlists.

## Version 1

#### [none]
- Methode-specific Java tags. **Absolutely do not use.**
