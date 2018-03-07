var buildAdConfig = require('./extensions/build-ad-config.js'),
    scrubMetadata = require('./util/scrub-metadata.js'),
    parseSettings = require('./util/parse-settings.js'),
    handler = require('./util/event-handler.js'),
    options = require('./util/environment-options.js');

/**
 * # Load Player
 * Create a new video player.
 * @param {string} id
 * @param {HTMLElement} container
 */
module.exports = function (id, container) {
    var playCount = 0,
        settings = parseSettings(container),
        player = window.AnvatoPlayer(id);

    // Player instance is fully loaded with the ready event.
    player.on('ready', function () {
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
    });

    //Setup pre-roll settings unless ads are manually disabled with query param.
    if (!options.noads) {
        player.on('beforeVideoLoad', function (video) {
            playCount += 1;

            // Update the DFP plugin with new ad targeting.
            return {
                plugins: {
                    dfp: {
                        clientSide: buildAdConfig(
                            scrubMetadata(video),
                            id,
                            container.getAttribute('data-cmsid'),
                            parseInt(container.getAttribute('data-dfp-timeout')),
                            // Only the first video played uses the VPX's topics and categories.
                            playCount === 1 ? container.getAttribute('data-topics') : [],
                            playCount === 1 ? container.getAttribute('data-categories') : []
                        )
                    }
                }
            };
        });
    }

    // Load the video player.
    player.init({
        accessKey: container.getAttribute('data-access-key'),
        video: container.getAttribute('data-videoid'),
        autoplay: settings.autoplay
    });

    // Add player to NewRelic video tracker.
    if (window.nrvideo) {
        nrvideo.Core.addTracker(new nrvideo.AnvatoTracker(id));
    }
};
