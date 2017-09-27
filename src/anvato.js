/**
 * # Anvato Video Player
 */

var handler = require('./util/event-handler.js');

module.exports = {
    /**
     * ## anvato.setup()
     * Setup all video players in the page.
     */
    setup: function () {
        try {
            // Setup NewRelic error reporting.
            require('./extensions/new-relic.js');

            // Setup and install AnvatoStrategy (Chartbeat metrics).
            require('./extensions/anvato-strategy.js');
            window._cbv_strategies = window._cbv_strategies || [];
            window._cbv_strategies.push(window.AnvatoStrategy);

            // Apply common config for all players.
            require('./set-common-config.js');

            // Setup video metrics.
            require('./extensions/metrics.js');

            // Load config and scripts for all the players.
            require('./load-players.js');
        } catch (err) {
            handler.trigger('cmg/error', err);
        }
    },
    /**
     * ## anvato.set(name, value)
     * Apply new common config. This must be called before `anvato.setup()`.
     */
    set: function (name, value) {
        var anvp = window.anvp = window.anvp || {};
        anvp.common = anvp.common || {};
        anvp.common.config = anvp.common.config || {};
        anvp.common.config[name] = value;
    },
    /**
     * ## anvato.pauseAll()
     * @see ./pause-all.js
     */
    pauseAll: require('./pause-all.js'),
    /**
     * ## anvato.on(name, callback)
     * @see ./util/event-handler.js
     */
    on: handler.on,
    /**
     * ## anvato.one(name, callback)
     * @see ./util/event-handler.js
     */
    one: handler.one,
    /**
     * ## anvato.off(name, callback)
     * @see ./util/event-handler.js
     */
    off: handler.off
};
