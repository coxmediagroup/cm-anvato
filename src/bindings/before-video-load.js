var buildAdConfig = require('../extensions/dfp.js'),
    options = require('../util/environment-options.js'),
    scrubMetadata = require('../util/scrub-metadata.js');

//Setup pre-roll settings unless ads are manually disabled.
module.exports = function (player, id, container) {
    var playCount = 0;

    player.on('beforeVideoLoad', function (video, initConfig) {
        // Check if this video should show pre-roll.
        if (options.noads || typeof initConfig.plugins.dfp === 'undefined' || initConfig.plugins.dfp.clientSide.adTagUrl === 'MCP_ENFORCED_DISABLE') {
            // Disable ads for this video.
            console.warn('[cmAnvato] Pre-roll DISABLE was requested for player', id);
            return false;
        }

        // Update the DFP plugin with new ad targeting.
        playCount += 1;
        return {
            plugins: {
                dfp: {
                    clientSide: buildAdConfig(
                        scrubMetadata(video),
                        id,
                        container.getAttribute('data-cmsid') || window.cmg.anvatoConf.cmsid,
                        initConfig.plugins.dfp.clientSide.adTagUrl,
                        window.parseInt(container.getAttribute('data-dfp-timeout')),
                        container.getAttribute('data-adunit'),
                        // Only the first video played uses the VPX's topics and categories.
                        playCount === 1 ? container.getAttribute('data-topics') : [],
                        playCount === 1 ? container.getAttribute('data-categories') : []
                    )
                }
            }
        };
    });
};
