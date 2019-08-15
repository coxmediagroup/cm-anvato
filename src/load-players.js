var loadPlayer = require('./load-player.js'),
    options = require('./util/environment-options.js'),
    ids = require('./util/id-factory.js');

// Ensure `anvload.js` has been loaded before loading any players.
module.exports = function () {
    if (window.AnvatoPlayer) {
        // `anvload.js` is already loaded, so start loading players.
        loadPlayers();
    } else {
        // Append `anvload.js` and then load players once it's ready.
        var script = document.createElement('script');
        script.src = getAnvatoUrl();
        script.onload = loadPlayers;
        document.body.appendChild(script);
    }
};

function getAnvatoUrl() {
    if (window.CMG_ANVATO_URL) {
        return window.CMG_ANVATO_URL;
    }
    var bundle = options.stage ? 'stage' : 'prod';
    return 'https://w3.cdn.anvato.net/player/' + bundle + '/v3/scripts/anvload.js';
}

// Loop through all the `anvato-player` divs and load video players.
function loadPlayers() {
    var players = document.getElementsByClassName('anvato-player'),
        count = players.length,
        i, player, id;

    for (i = 0; i < count; i += 1) {
        player = players[0];

        if (player.id) {
            // Retain any existing element id.
            id = player.id;
        } else {
            // Otherwise, generate a new safe id.
            id = player.id = 'p' + ids.next();
        }

        loadPlayer(id, player);
    }
}
