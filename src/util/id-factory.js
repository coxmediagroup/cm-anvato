// Ensure ids start at 0;
var curr = -1;

/**
 * # ID Factory
 * Global state factory to ensure player ids are unique.
 */
module.exports = {
    /**
     * ## ids.next()
     * @return {number} Next available id.
     */
    next: function () {
        curr += 1;
        return curr;
    },
    current: function () {
        return curr;
    }
};
