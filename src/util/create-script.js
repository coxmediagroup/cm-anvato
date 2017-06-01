/**
 * @param {string} id Player's HTML id.
 * @param {function} done Called when script has finished loading.
 */
module.exports = function (id, done) {
    var script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.setAttribute('data-anvp', JSON.stringify({
        pInstance: id
    }));
    script.onload = function () {
        /**
         * Anvato's code looks for `data-anvp` attribute when loading players. Now
         * that this player has been loaded, remove the attribute to force Anvato
         * to ignore this script tag when loading other players.
         */
        this.removeAttribute('data-anvp');
        done();
    };
    script.src = 'https://w3.cdn.anvato.net/player/prod/v3/scripts/anvload.js';
    document.body.appendChild(script);
};
