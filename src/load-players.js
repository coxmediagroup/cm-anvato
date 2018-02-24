var loadPlayer = require('./load-player.js'),
    options = require('./util/environment-options.js'),
    bundle = options.stage ? 'stage' : 'prod',
    ids = require('./util/id-factory.js');

// Ensure `anvload.js` has been loaded before loading any players.
module.exports = function () {
    if (window.AnvatoPlayer) {
        // `anvload.js` is already loaded, so start loading players.
        loadPlayers();
    } else {
        // Append `anvload.js` and then load players once it's ready.
        var script = document.createElement('script');
        script.src = 'https://w3.cdn.anvato.net/player/' + bundle + '/v3/scripts/anvload.js';
        script.onload = loadPlayers;
        document.body.appendChild(script);
    }
};

// Loop through all the `anvato-player` divs and load video players.
function loadPlayers() {
    var players = document.getElementsByClassName('anvato-player'),
        count = players.length,
        i, player, id;

    for (i = 0; i < count; i += 1) {
        player = players[0];
        id = player.id = 'p' + ids.next();
        loadPlayer(id, player);
    }
}
