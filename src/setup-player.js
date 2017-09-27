var parseSettings = require('./util/parse-settings.js'),
    buildAdConfig = require('./extensions/build-ad-config.js'),
    scrubMetadata = require('./util/scrub-metadata.js'),
    options = require('./util/environment-options.js');

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
        onReady: function (player) {
            // Add the player to Chartbeat (metrics).
            window._cbv = window._cbv || [];
            window._cbv.push(player);

            // Mute player if requested.
            if (settings.muted) {
                try {
                    player.mute();
                } catch (err) {
                    handler.trigger('cmg/error', err);
                }
            }
        }
    };

    /**
     * Setup pre-roll settings unless ads are manually disabled with query param.
     */
    if (!options.noads) {
        anvp[id].onBeforeVideoLoad = function (video) {
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
        };
    }
};
