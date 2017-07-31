/**
 * @param {string} id Player's HTML id.
 */
module.exports = function (id) {
    // Create the script element and add to the DOM.
    var script = '<scr' + 'ipt';
    script += ' src="https://w3.cdn.anvato.net/player/prod/v3/scripts/anvload.js"';
    script += ' data-anvp=\'{"pInstance":"' + id + '"}\'></scr' + 'ipt>';
    document.write(script);
};
