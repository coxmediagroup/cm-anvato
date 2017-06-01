// Setup and install AnvatoStrategy.
require('./extensions/anvato-strategy.js');
window._cbv_strategies = window._cbv_strategies || [];
window._cbv_strategies.push(window.AnvatoStrategy);

// Apply common config for all players.
require('./set-common-config.js');

// Setup video metrics.
require('./extensions/metrics.js');

// Load any uninitialized Anvato players. Recurses for each player
// because Anvato is the worst.
var loadNextPlayer = require('./load-next-player.js');
loadNextPlayer();
