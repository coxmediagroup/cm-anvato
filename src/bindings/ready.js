/**
 * Player instance is fully loaded with the ready event.
 */
module.exports = function (player, muted) {
    player.on('ready', function () {
        /**
         * Add the player to the Chartbeat Video tracker.
         * @see http://support.chartbeat.com/docs/video.html#jssdk
         */
        window._cbv = window._cbv || [];
        window._cbv.push(player);

        // Mute player if requested.
        if (muted) {
            player.mute();
        }
    });
};
