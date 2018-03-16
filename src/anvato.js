var loadPlayers = require('./load-players.js'),
    setupDTM = require('./extensions/dtm.js'),
    setupChartbeat = require('./extensions/chartbeat/setup.js'),
    cache = require('./util/player-cache.js'),
    events = require('./util/event-handler.js');

module.exports = {
    /**
     * Safely fetch a player regardless of Anvato's load state.
     * If a player is not created yet, the request will be cached.
     */
    get: function (id) {
        return {
            // Emulate a Promise.
            then: function (resolve) {
                cache.get(id, resolve);
            }
        };
    },
    getAll: function () {
        return {
            then: function (resolve) {
                events.on('cmg/loaded', resolve);
            }
        };
    },
    on: events.on,
    /**
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
     * Manually load any pending video players. Note this method assumes global
     * state has finished setting up.
     */
    loadPlayers: loadPlayers,
    /**
     * Set up metrics for pages that load videos manually.
     */
    setupMetrics: setupDTM,
    /**
     * Syntactic sugar to apply common config.
     */
    set: function (name, value) {
        var anvp = window.anvp = window.anvp || {};
        anvp.common = anvp.common || {};
        anvp.common.config = anvp.common.config || {};
        anvp.common.config[name] = value;
    },
    /**
     * Pause all players in the page.
     */
    pauseAll: require('./pause-all.js')
};
