var $ = require('jquery'),
    setupPlayer = require('../setup-player.js'),
    options = require('../util/environment-options.js'),
    bundle = options.stage ? 'stage' : 'prod',
    ids = require('../util/id-factory.js');

/**
 * Write the Anvato player script into the page while the page is loaded. Use of
 * `document.write()` is intentional as it is the only way to work around race
 * conditions in the Anvato player code without resorting to chain loading.
 * @see ../load-players.js
 */
module.exports = function () {
    $('.anvato-player').each(function (i, el) {
        var id = el.id = 'p' + ids.next();
        setupPlayer(id, $(el));

        var script = '<scr' + 'ipt';
        script += ' src="https://w3.cdn.anvato.net/player/' + bundle + '/v3/scripts/anvload.js"';
        script += ' data-anvp=\'{"pInstance":"' + id + '"}\'></scr' + 'ipt>';
        document.write(script);
    });
};
