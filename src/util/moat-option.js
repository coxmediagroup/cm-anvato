/**
 * Parse anvatoEnableMoat environment variable.
 * @returns {Boolean}
 */

var enableMoat = false,
    el = document.getElementsByClassName('anvatoEnableMoat');

if (el.length) {
    el = el[0];

    try {
        var value = el.getAttribute('data-value') || false;
        enableMoat = JSON.parse(value);
    } catch (err) {
        console.error(
            err.name,
            err.message,
            '\n\t- value:', value
        );
    }
}

module.exports = enableMoat;
