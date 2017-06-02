var parseSettings = require('./util/parse-settings.js'),
    buildAdConfig = require('./extensions/build-ad-config.js'),
    scrubMetadata = require('./util/scrub-metadata.js');

/**
 * @param {string} id
 * @param {jQuery} player
 */
module.exports = function loadPlayer(id, player) {
    var anvp = window.anvp = window.anvp || {},
        settings = parseSettings(player),
        playCount = 0;

    anvp[id] = {
        config: {
            video: player.data('videoid'),
            autoplay: settings.autoplay
        },
        onBeforeVideoLoad: function (video) {
            playCount += 1;

            // Update the DFP plugin with new ad targeting.
            return {
                plugins: {
                    dfp: {
                        clientSide: buildAdConfig(
                            scrubMetadata(video),
                            id,
                            // Only the first video played uses the VPX's topics and categories.
                            playCount === 1 ? player.data('topics') : [],
                            playCount === 1 ? player.data('categories') : []
                        )
                    }
                }
            };
        },
        onReady: function (player) {
            // No idea what this is, but Shaun wants it here.
            window._cbv = window._cbv || [];
            window._cbv.push(player);

            // Mute player if requested.
            if (settings.muted) {
                player.mute();
            }
        }
    };
};
