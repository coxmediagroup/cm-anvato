/**
 * # anvato.pauseAll()
 * Pause all players in the page.
 */
module.exports = function () {
    var anvp = window.anvp = window.anvp || {};
    if (anvp.getAll) {
        anvp.getAll().forEach(function(id) {
            var player = anvp[id];
            if (player && player.pause) {
                player.pause();
            }
        });
    }
};
