var events = require('../util/event-handler.js'),
    // Used to filter duplicate play events with pre-roll.
    playCache = {},
    // Warehouse of metadata by player id.
    meta = {};

/**
 * Connect player events to DTM.
 */
module.exports = function () {
    if (!window.DDO || !window.DDO.action) {
        console.warn('[cmAnvato] Cannot find DDO object! Video metrics are OFFLINE.');
    }

    window.anvp = window.anvp || {};
    anvp.listener = function (event) {
        // Trigger this event for non-metrics code to use.
        events.trigger(event.name, event);

        if (window.DDO && window.DDO.action) {
            var id = event.sender;

            if (event.name === 'METADATA_LOADED') {
                // Ensure videoPlayerLoad action fires only once per session per video.
                if(!meta[id]) {
                    fire('videoPlayerLoad', id);
                }

                playCache[id] = false;
                meta[id] = meta[id] || {};
                meta[id].videoid = event.args[1];
                meta[id].tags = event.args[2].tags;
                meta[id].title = event.args[2].title;
                meta[id].duration = event.args[2].duration;
            } else if (event.name === 'AD_STARTED') {
                fire('videoAdStart', id);

                // If playCache[id] is still undefined here,
                // then this must be a preroll ad,
                // so fire videoStart and validate playCache[id]
                if (!playCache[id]) {
                    fire('videoStart', id);
                    playCache[id] = true;
                }
            } else if (event.name === 'AD_COMPLETED' || event.name === 'AD_SKIPPED') {
                fire('videoAdComplete', id);
            } else if (event.name === 'VIDEO_STARTED') {
                // Ensure videoStart action only fires once per content.
                if (!playCache[id]) {
                    fire('videoStart', id);
                    playCache[id] = true;
                }
                fire('videoContentPlay', id);
            } else if (event.name === 'USER_PAUSE') {
                fire('videoPause', id);
            } else if (event.name === 'TIME_UPDATED' && event.args && event.args[0] === 10) {
                // 10 sec checkpoint
                fire('videoViewCheckpoint', id);
            } else if (event.name === 'VIDEO_FIRST_QUARTILE') {
                fire('videoView25Checkpoint', id);
            } else if (event.name === 'VIDEO_MID_POINT') {
                fire('videoView50Checkpoint', id);
            } else if (event.name === 'VIDEO_THIRD_QUARTILE') {
                fire('videoView75Checkpoint', id);
            } else if (event.name === 'VIDEO_COMPLETED') {
                fire('videoComplete', id);
            }
        }
    };
};

/**
 * Publish a DDO action.
 * @param {String} name DDO action name
 * @param {String} id Anvato player id.
 */
function fire(name, id) {
    var player = window.anvp[id];

    // Accommodate for the async player method.
    player.getCurrentTime(function (time) {
        window.DDO.action(name, {
            videoContentType: player.mergedConfig.live ? 'live' : 'vod',
            videoId: meta[id].videoid,
            videoName: meta[id].title,
            videoPlayer: 'Anvato Universal Player-' + id,
            videoPlayType: player.mergedConfig.autoplay ? 'auto-play' : 'manual play',
            videoSiteAccountID: player.mergedConfig.accessKey,
            videoSecondsViewed: Math.round(time),
            videoSource: 'Anvato',
            videoTopics: meta[id].tags,
            videoTotalTime: meta[id].duration
        });

        // Where auto-play should be valid after *any* (manually-started) video has *completed*
        if(name === "videoComplete" && player.mergedConfig.autoplayOnFirstComplete && !player.mergedConfig.autoplay) {
            player.mergedConfig.autoplay = true;
        }
    });
}
