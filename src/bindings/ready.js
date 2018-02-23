var handler = require('../util/event-handler.js');

module.exports = function (player, muted) {
    // Player instance is fully loaded with the ready event.
    player.on('ready', function () {
        // Add the player to Chartbeat (metrics).
        window._cbv = window._cbv || [];
        window._cbv.push(player);

        // Mute player if requested.
        if (muted) {
            player.mute();
        }
    });
};
