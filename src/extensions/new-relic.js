var handler = require('../util/event-handler.js');

/**
 * Report all DFP plugin errors to NewRelic and bark to the console.
 */
handler.on('PLAYER_ERROR', function (event) {
    if (event.args[0] === 'DFP010') {
        console.error('[ANVATO DFP ERROR]', event.args[0], event.args[1]);
        if (window.newrelic) {
            window.newrelic.addPageAction('cmg_video_dfp', {
                cmg_video_dfp_error: event.args[1]
            });
        }
    }
});
