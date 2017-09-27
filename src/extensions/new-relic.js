var handler = require('../util/event-handler.js'),
    start = performance.now(),
    playStarts = {},
    firstPlay = true;

// Create a time interval in seconds with 2 decimal place precision.
function trip(then) {
    var diff = performance.now() - then;
    return Math.round(diff / 1000 * 100) / 100;
}

/**
 * Report all JavaScript errors.
 */
handler.on('cmg/error', function (err) {
    console.error('[ANVATO ERROR]', err.name, err.message, err);
    if (window.newrelic) {
        window.newrelic.addPageAction('cmg_video_error', {
            cmg_video_id: err.name,
            cmg_video_message: err.message
        });
    }
});

/**
 * Report the load time of each pre-roll.
 */
handler.on('AD_STARTED', function (event) {
    if (window.newrelic) {
        window.newrelic.addPageAction('cmg_video_ad_started', {
            cmg_video_id: event.args[0],
            cmg_video_title: event.args[1],
            cmg_video_provider: event.args[2],
            cmg_video_load_time: trip(playStarts[event.sender]),
            cmg_video_timestamp: event.time
        });
    }
});

/**
 * Report all player errors to NewRelic and bark to the console.
 * Error PLAY920 is a generic playlist error that means very little. It is filtered
 * out from NewRelic to avoid creating unnecessary noise.
 */
handler.on('PLAYER_ERROR', function (event) {
    if (event.args[0] !== 'PLAY920') {
        console.error('[ANVATO ERROR]', event.args[0], event.args[1]);
        if (window.newrelic) {
            window.newrelic.addPageAction('cmg_video_error', {
                cmg_video_id: event.args[0],
                cmg_video_message: event.args[1],
                cmg_video_timestamp: event.time
            });
        }
    }
});

/**
 * Report play events to NewRelic to establish a baseline pulse.
 */
handler.on('USER_PLAY', function (event) {
    if (window.newrelic) {
        if (firstPlay) {
            firstPlay = false;
            window.newrelic.addPageAction('cmg_video_player_load', {
                cmg_video_load_time: trip(start),
                cmg_video_timestamp: event.time
            });
        }
        window.newrelic.addPageAction('cmg_video_play');
        playStarts[event.sender] = performance.now();
    }
});
