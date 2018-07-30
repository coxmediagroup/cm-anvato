/**
 * `Object.values()` with fallback for IE.
 * @param {Object} map
 * @returns {Array}
 */
module.exports = function (map) {
    if (Object.values) {
        return Object.values(map);
    }

    var key, set = [];
    for (key in map) {
        set.push(map[key]);
    }
    return set;
};
