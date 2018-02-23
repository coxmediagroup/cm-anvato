var parseSettings = require('./util/parse-settings.js'),
    bindOnReady = require('./bindings/ready.js'),
    bindBeforeVideoLoad = require('./bindings/before-video-load.js');

/**
 * # Load Player
 * Create a new video player.
 * @param {string} id
 * @param {HTMLElement} container
 */
module.exports = function (id, container) {
    var settings = parseSettings(container),
        player = window.AnvatoPlayer(id);

    // Player instance is fully loaded with the ready event.
    bindOnReady(player, settings.muted);

    // Setup pre-roll settings unless ads are manually disabled.
    bindBeforeVideoLoad(player, id, container);

    // Load the video player.
    player.init({
        accessKey: container.getAttribute('data-access-key'),
        video: container.getAttribute('data-videoid'),
        autoplay: settings.autoplay
    });

    // Add player to NewRelic video tracker.
    if (window.nrvideo) {
        nrvideo.Core.addTracker(new nrvideo.AnvatoTracker(id));
    }
};
