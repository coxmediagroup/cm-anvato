var objectValues = require('./object-values.js'),
    players = {},
    requests = {};

module.exports = {
    /**
     * Get a player instance or cache its request.
     */
    get: function (id, resolve) {
        if (!id) {
            resolve(objectValues(players));
        } else if (id in players) {
            // Player already exists, so resolve immediately.
            resolve(players[id]);
        } else {
            // Cache this request until the player exists.
            requests[id] = requests[id] || [];
            requests[id].push(resolve);
        }
    },
    /**
     * Add a player instance to cache and resolve any
     * outstanding requests.
     */
    add: function (id, player) {
        // Cache this player.
        players[id] = player;

        // Resolve any outstanding requests for this player.
        if (id in requests) {
            requests[id].forEach(function (resolve) {
                resolve(player);
            });
            // Promises resolve only once.
            requests[id] = [];
        }
    }
};
