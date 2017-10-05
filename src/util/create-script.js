var options = require('./environment-options.js'),
    bundle = options.stage ? 'stage' : 'prod';

/**
 * @param {string} id Player's HTML id.
 */
module.exports = function (id) {
    // Create the script element and add to the DOM.
    var script = document.createElement('script');
    script.src = 'https://w3.cdn.anvato.net/player/' + bundle + '/v3/scripts/anvload.js';
    script.setAttribute('data-anvp', '{"pInstance":"' + id + '"}');
    document.getElementById(id).appendChild(script);
};
