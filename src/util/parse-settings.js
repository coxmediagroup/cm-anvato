var options = require('./environment-options.js');

/**
 * @param {jQuery} player The video player.
 * @return {Object<boolean, boolean>} Autoplay and mute settings for this player.
 */
module.exports = function (player) {
    var topics = player.getAttribute('data-topics') || '',
        autoplay = player.getAttribute('data-autoplay') === 'true' || false,
        muted = player.getAttribute('data-muted') === 'true' || false;
    topics = topics.split(',');

    /**
     * The topic "autoplay-on-sound-on" is a reserved topic that will allow this
     * player to be super annoying. This should be the only place where autoplay
     * with sound is permitted.
     */
    if (topics.indexOf('autoplay-on-sound-on') >= 0) {
        autoplay = true;
        muted = false;
    }

    /**
     * Finally apply any manual url query overrides.
     */
    return {
        autoplay: 'autoplay' in options ? (options.autoplay === 'true') : autoplay,
        muted: 'mute' in options ? (options.mute === 'true') : muted
    };
};
