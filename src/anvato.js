// Setup common player config and install AnvatoStrategy.
window._cbv_strategies = window._cbv_strategies || [];
window._cbv_strategies.push(window.AnvatoStrategy);
require('./set-common-config.js');

// Setup video metrics.
require('./metrics.js');

// Load any uninitialized Anvato players. Recurses for each player
// because Anvato is the worst.
var loadNextPlayer = require('./load-next-player.js'),
loadNextPlayer(0);
