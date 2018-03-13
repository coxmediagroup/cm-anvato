var handler = require('../util/event-handler.js'),
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
        /**
         * Trigger any player event for non-metrics code to use.
         * Video playlists use these events.
         */
        handler.trigger(event.name, event);

        if (window.DDO && window.DDO.action) {
            var id = event.sender;

            if (event.name === 'METADATA_LOADED') {
                playCache[id] = false;
                meta[id] = meta[id] || {};
                meta[id].videoid = event.args[1];
                meta[id].tags = event.args[2].tags;
            } else if (event.name === 'AD_STARTED') {
                playCache[id] = true;
                fire('videoStart', id);
            } else if (event.name === 'VIDEO_STARTED') {
                /**
                 * Ensure `video-start` only fires once per content. This event fires once
                 * with the pre-roll and again with the content.
                 */
                if (!playCache[id]) {
                    fire('videoStart', id);
                }
                fire('videoContentPlay', id);
            } else if (event.name === 'USER_PAUSE') {
                fire('videoPause', id);
            } else if (event.name === 'VIDEO_COMPLETED') {
                fire('videoComplete', id);
            }
        }
    };
};

function fire(name, id) {
    var remaining = 3,
        player = window.anvp[id],
        data = {
            videoContentType: player.mergedConfig.live ? 'live' : 'vod',
            videoId: meta[id].videoid,
            videoPlayer: 'Anvato Universal Player-' + id,
            videoPlayType: player.mergedConfig.autoplay ? 'auto-play' : 'manual play',
            videoSiteAccountID: player.mergedConfig.accessKey,
            videoSource: 'Anvato',
            videoTopics: meta[id].tags
        };

    // Semaphore for Anvato SDK async methods.
    function done() {
        remaining -= 1;
        if (!remaining) {
            // Publish the actual metrics event.
            window.DDO.action(name, data);
        }
    }

    // Accommodate the small couple of async data points for this video.
    player.getTitle(function (title) {
        data.videoName = title;
        done();
    });
    player.getCurrentTime(function (time) {
        data.videoSecondsViewed = time;
        done();
    });
    player.getDuration(function (duration) {
        data.videoTotalTime = duration;
        done();
    });
}
