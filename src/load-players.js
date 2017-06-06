var $ = require('jquery'),
    setupPlayer = require('./setup-player.js'),
    createScript = require('./util/create-script.js');

/**
 * Players start with class name `anvato-player`. As the Anvato library
 * processes the page, it removes the original container and replaces it
 * with the player's iframe.
 */
$('.anvato-player').each(function (i, el) {
    var id = el.id = 'p' + i;
    setupPlayer(id, $(el));
    createScript(id);
});
