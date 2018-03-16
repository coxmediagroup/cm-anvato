var cache = {},
    triggerCache = {};

module.exports = {
    on: function (name, callback) {
        cache[name] = cache[name] || [];
        cache[name].push(callback);

        if (name in triggerCache) {
            callback(triggerCache[name]);
        }
    },
    trigger: function (name, data) {
        triggerCache[name] = data;
        if (name in cache) {
            cache[name].forEach(function (callback) {
                callback(data);
            });
        }
    }
};
