var objectValues = require('./object-values.js');

// Make global for temporary Turbolinks fix.
window.cmAnvatoCache = window.cmAnvatoCache || {
    players: {},
    requests: {}
};

module.exports = {
    /**
     * Get a player instance or cache its request.
     */
    get: function (id, resolve) {
        if (!id) {
            resolve(objectValues(cmAnvatoCache.players));
        } else if (id in cmAnvatoCache.players) {
            // Player already exists, so resolve immediately.
            resolve(cmAnvatoCache.players[id]);
        } else {
            // Cache this request until the player exists.
            cmAnvatoCache.requests[id] = cmAnvatoCache.requests[id] || [];
            cmAnvatoCache.requests[id].push(resolve);
        }
    },
    /**
     * Add a player instance to cache and resolve any
     * outstanding requests.
     */
    add: function (id, player) {
        // Cache this player.
        cmAnvatoCache.players[id] = player;

        // Resolve any outstanding requests for this player.
        if (id in cmAnvatoCache.requests) {
            cmAnvatoCache.requests[id].forEach(function (resolve) {
                resolve(player);
            });
            // Promises resolve only once.
            cmAnvatoCache.requests[id] = [];
        }
    }
};
