/**
 * # Anvato Video Player
 */

var handler = require('./util/event-handler.js');

module.exports = {
    /**
     * # anvato.setup()
     * Setup all video players in the page.
     */
    setup: function () {
        // Setup and install AnvatoStrategy.
        require('./extensions/anvato-strategy.js');
        window._cbv_strategies = window._cbv_strategies || [];
        window._cbv_strategies.push(window.AnvatoStrategy);

        // Apply common config for all players.
        require('./set-common-config.js');

        // Setup video metrics.
        require('./extensions/metrics.js');

        // Load config and scripts for all the players.
        require('./load-players.js');
    },
    /**
     * # anvato.on(name, callback)
     * @see ./util/event-handler.js
     */
    on: handler.on,
    /**
     * # anvato.one(name, callback)
     * @see ./util/event-handler.js
     */
    one: handler.one,
    /**
     * # anvato.off(name, callback)
     * @see ./util/event-handler.js
     */
    off: handler.off
};
