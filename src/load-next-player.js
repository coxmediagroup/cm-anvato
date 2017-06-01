var $ = require('jquery'),
    setupPlayer = require('./setup-player.js'),
    createScript = require('./create-script.js'),
    playerCount = 0;

/**
 * Load the next uninitialized player in the page. Recurses for each player
 * since Anvato's API does not natively support multiple players in the same page.
 * Recursion happens with the `onload` event of the `anvload.js` script.
 */
module.exports = function loadNextPlayer() {
    var player = $('.anvato-player').eq(0);

    if (player.length) {
        /**
         * Break up loading to avoid tanking the framerate on pages with multiple
         * video players - such as video playlists.
         */
        window.setTimeout(function () {
            var el = player[0];
            var id = el.id = 'p' + playerCount;

            setupPlayer(id, player);
            createScript(id, loadNextPlayer);

            playerCount += 1;
        }, 0);
    }
};
