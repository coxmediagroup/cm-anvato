var $ = require('jquery'),
    setupPlayer = require('./setup-player.js'),
    handler = require('./util/event-handler.js'),
    options = require('./util/environment-options.js'),
    bundle = options.stage ? 'stage' : 'prod',
    ids = require('./util/id-factory.js');

/**
 * Load additional players separate from the normal in page players. This
 * is an option for players loaded through events such as ajax or clicks.
 * Players much chain load through their onReady events to avoid collision
 * in the global state of Anvato's code.
 * @see ../load-players.js
 */
module.exports = function () {
    var players = $('.anvato-player');
    if (players.length) {
        var id = players[0].id = 'p' + ids.next();
        setupPlayer(id, players.eq(0));

        // Players loaded after DOM has completed must chain load.
        handler.on('cmg/ready', function (player) {
            // Recurse after this player is done loading.
            if (player === window.anvp[id]) {
                module.exports();
            }
        });

        var script = document.createElement('script');
        script.src = 'https://w3.cdn.anvato.net/player/' + bundle + '/v3/scripts/anvload.js';
        script.setAttribute('data-anvp', '{"pInstance":"' + id + '"}');
        document.body.appendChild(script);
    }
};
