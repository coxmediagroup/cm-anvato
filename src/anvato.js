/**
 * # Anvato Video Player
 */

var handler = require('./util/event-handler.js'),
    loadPlayers = require('./load-players.js'),
    setupMetrics = require('./extensions/metrics.js');

module.exports = {
    /**
     * ## anvato.setup()
     * Setup all video players in the page.
     */
    setup: function () {
        try {
            // Setup and install AnvatoStrategy for Chartbeat metrics.
            require('./extensions/chartbeat-strategy.js');
            window._cbv_strategies = window._cbv_strategies || [];
            window._cbv_strategies.push(window.AnvatoStrategy);

            // Load the NewRelic video tracker.
            if (window.newrelic) {
                require('./extensions/newrelic-video-anvato.min.js');
            }

            // Apply common config for all players.
            require('./set-common-config.js');

            // Setup video metrics.
            setupMetrics();

            // Load config and scripts for all the players.
            loadPlayers();
        } catch (err) {
            handler.trigger('cmg/error', err);
        }
    },
    /**
     * ## anvato.loadPlayers()
     * Manually load any pending video players. Note this method assumes global
     * state has finished setting up.
     * @see `anvato.setup()`
     */
    loadPlayers: loadPlayers,
    /**
     * ## anvato.setupMetrics()
     * Set up metrics for pages that load videos manually.
     */
    setupMetrics: setupMetrics,
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
