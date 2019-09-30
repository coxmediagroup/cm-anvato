var buildAdConfig = require('../extensions/dfp.js'),
    options = require('../util/environment-options.js'),
    scrubMetadata = require('../util/scrub-metadata.js');

//Setup pre-roll settings unless ads are manually disabled.
module.exports = function (player, id, container) {
    var playCount = 0;

    player.on('beforeVideoLoad', function (video, initConfig) {
        var initDfp = initConfig.plugins.dfp;

        // Check if this video should show pre-roll.
        if (options.noads || typeof initDfp === 'undefined' || typeof initDfp.clientSide === 'undefined' || initDfp.clientSide.adTagUrl === 'MCP_ENFORCED_DISABLE') {
            // Disable ads for this video.
            console.warn('[cmAnvato] Pre-roll DISABLE was requested for player', id);
            return false;
        }

        playCount += 1;
        var dfpClientSide = buildAdConfig(
            scrubMetadata(video),
            id,
            container.getAttribute('data-cmsid') || window.cmg.anvatoConf.cmsid,
            initDfp.clientSide.adTagUrl,
            window.parseInt(container.getAttribute('data-dfp-timeout')),
            container.getAttribute('data-adunit'),
            // Only the first video played uses the VPX's topics and categories.
            playCount === 1 ? container.getAttribute('data-topics') : [],
            playCount === 1 ? container.getAttribute('data-categories') : []
        );

        if (dfpClientSide) {
            // Update the DFP plugin with new ad targeting.
            initConfig.plugins.dfp.clientSide = dfpClientSide;
        } else {
            console.warn('[cmAnvato] was not able to build client-side ad config. Using initial configs for player', id);
        }

        return initConfig;
    });
};
