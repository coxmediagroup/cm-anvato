/**
 * # Map Merge Left
 * Shallow merge two Objects.
 * @param {Object} first
 * @param {Object} second
 * @return {Object}
 */
module.exports = function (first, second) {
    var key;
    first = first || {};
    second = second || {};
    for (key in second) {
        first[key] = second[key];
    }
    return first;
};
