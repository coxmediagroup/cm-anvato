var parseSettings = require('./util/parse-settings.js'),
    bindOnReady = require('./bindings/ready.js'),
    bindBeforeVideoLoad = require('./bindings/before-video-load.js'),
    nrvideo = require('./extensions/newrelic.min.js'),
    bindChartbeat = require('./extensions/chartbeat/bind-meta.js'),
    cache = require('./extensions/player-cache.js');

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
        accessKey: container.getAttribute('data-access-key') || window.cmg.anvatoConf.accessKey,
        playlist: container.getAttribute('data-videoid').split(','),
        autoplay: settings.autoplay
    });

    // Cache this new player and handle any cached player requests.
    cache.add(id, player);

    // Add player to NewRelic video tracker.
    if (window.newrelic) {
        nrvideo.Core.addTracker(new nrvideo.AnvatoTracker(id));
    } else {
        console.warn('[cmAnvato] Cannot find newrelic object! Video tracking is OFFLINE.');
    }

    // Setup event bindings for Chartbeat's Strategy.
    bindChartbeat(player);
};
