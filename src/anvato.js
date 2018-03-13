var handler = require('./util/event-handler.js'),
    loadPlayers = require('./load-players.js'),
    setupDTM = require('./extensions/dtm.js');
    setupChartbeat = require('./extensions/chartbeat/setup.js');

module.exports = {
    /**
     * ## anvato.setup()
     * Setup all video players in the page.
     */
    setup: function () {
        // Apply common config for all players.
        require('./set-common-config.js');

        // Setup video metrics.
        setupChartbeat();
        setupDTM();

        // Load config and scripts for all the players.
        loadPlayers();
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
    setupMetrics: setupDTM,
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
