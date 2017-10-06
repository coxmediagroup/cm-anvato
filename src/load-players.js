var loadAsync = require('./actions/load-players-async.js'),
    loadSync = require('./actions/load-players-sync.js');

/**
 * Load in players as fast as possible. Speed is gated by the DOM ready event
 * because of race conditions in the Anvato library.
 *
 * TODO: Once the Anvato global constructor `AnvatoPlayer` is fully released,
 * please remove all `doc.write` and `appendChild` and replace with calls to
 * the global `AnvatoPlayer()`.
 *
 * Players start with class name `anvato-player`. As the Anvato library
 * processes the page, it removes the original container and replaces it
 * with the player's iframe.
 */
module.exports = function () {
    if (document.readyState === 'loading') {
        loadSync();
    } else {
        loadAsync();
    }
};
