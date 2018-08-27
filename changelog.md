# Change Log for CMG Anvato Integration
All notable changes to the repo will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
For information on Anvato Player changes, see their [changelog](https://dev.anvato.net/api/player#release-notes).

## Version 2

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
