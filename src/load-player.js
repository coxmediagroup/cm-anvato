var parseSettings = require('./util/parse-settings.js'),
    bindOnReady = require('./bindings/ready.js'),
    bindBeforeVideoLoad = require('./bindings/before-video-load.js'),
    nrvideo = require('./extensions/newrelic.min.js'),
    bindChartbeat = require('./extensions/chartbeat/bind-meta.js'),
    initPlugins = require('./util/init-plugins.js'),
    parseAttribute = require('./util/parse-attribute.js'),
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
        playlist: container.getAttribute('data-videoid').split(','),
        accessKey: container.getAttribute('data-access-key') || cmg.anvatoConf.accessKey, // DEPRECATED
        autoplay: settings.autoplay, // DEPRECATED
        recom: settings.recom // DEPRECATED
    };

    // Merge in any native anvato settings.
    var count = container.attributes.length, i, pair;
    for (i = 0; i < count; i += 1) {
        pair = container.attributes[i];
        if (pair.name.indexOf('data-anv-') === 0) {
            var name = pair.name.substr(9).replace(/-([a-z])/g, function (match, word) {
                return word.toUpperCase();
            });
            config[name] = parseAttribute(pair.value);
        }
    }

    var playerInitPlugins = initPlugins.get(id);
    if (playerInitPlugins) {
        config.plugins = playerInitPlugins;
    }

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
