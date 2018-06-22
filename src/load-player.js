var parseSettings = require('./util/parse-settings.js'),
    bindOnReady = require('./bindings/ready.js'),
    bindBeforeVideoLoad = require('./bindings/before-video-load.js'),
    nrvideo = require('./extensions/newrelic.min.js'),
    bindChartbeat = require('./extensions/chartbeat/bind-meta.js'),
    cache = require('./util/player-cache.js'),
    cmg = require('./extensions/cmg.js');

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

    // Generate the player config object.
    var config = {
        accessKey: container.getAttribute('data-access-key') || cmg.anvatoConf.accessKey, // DEPRECATED
        playlist: container.getAttribute('data-videoid').split(','),
        autoplay: settings.autoplay, // DEPRECATED
        recom: settings.recom // DEPRECATED
    };
    // Merge in any native anvato settings.
    [].forEach.call(container.attributes, function (pair) {
        if (pair.name.indexOf('data-anv-') === 0) {
            var name = pair.name.substr(9).replace(/-([a-z])/g, function (match, word) {
                return word.toUpperCase();
            });
            config[name] = pair.value;
        }
    });

    // Load the video player.
    player.init(config);

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

    return player;
};
