/**
 * @param {jQuery} player The video player.
 * @return {Object<boolean, boolean>} Autoplay and mute settings for this player.
 */
module.exports = function (player) {
    let topics = player.data('topics') || '',
        autoplay = player.data('autoplay') || false,
        muted = player.data('muted') || false;
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

    return {
        autoplay: autoplay,
        muted: muted
    };
};
