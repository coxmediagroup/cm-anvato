var initPlugins = {};

module.exports = {
    set: function (playerId, plugins) {
        initPlugins[playerId] = plugins;
    },
    get: function (playerId) {
        return initPlugins[playerId];
    }
};
