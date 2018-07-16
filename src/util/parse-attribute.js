/**
 * @param {String} attribute
 */
module.exports = function (attribute) {
    if (attribute === 'true') {
        return true;
    } else if (attribute === 'false') {
        return false;
    }
    return attribute;
};
