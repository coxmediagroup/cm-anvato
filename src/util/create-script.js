/**
 * @param {string} id Player's HTML id.
 */
module.exports = function (id) {
    var script = document.createElement('script');
    script.setAttribute('data-anvp', JSON.stringify({
        pInstance: id
    }));
    script.src = 'https://w3.cdn.anvato.net/player/prod/v3/scripts/anvload.js';
    document.write(script);
};
