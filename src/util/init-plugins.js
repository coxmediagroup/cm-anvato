/**
 * Allow for setting and retrieving individual player initial plugin configs
 */

var initPlugins = {};

module.exports = {
    set: function (playerId, plugins) {
        initPlugins[playerId] = plugins;
    },
    get: function (playerId) {
        return initPlugins[playerId];
    }
};
