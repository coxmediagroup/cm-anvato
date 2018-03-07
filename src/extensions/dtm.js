var handler = require('../util/event-handler.js'),
    // Used to filter duplicate play events with pre-roll.
    playCache = {},
    // Warehouse of tags by video id.
    tags = {};

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
            var video = event.args[1],
                player = event.sender;

            if (event.name === 'METADATA_LOADED') {
                tags[video] = tags[video] || {};
                tags[video].tags = event.args[2].tags;
            } else if (event.name === 'PLAYING_START') {
                /**
                 * Ensure `video-start` only fires once per content. This event fires once
                 * with the pre-roll and again with the content.
                 */
                if (!playCache[player]) {
                    playCache[player] = true;
                    fire('videoStart', player, video);
                }
            } else if (event.name === 'VIDEO_STARTED') {
                fire('videoContentPlay', player, video);
            } else if (event.name === 'USER_PAUSE') {
                fire('videoPause', player, video);
            } else if (event.name === 'VIDEO_COMPLETED') {
                playCache[player] = false;
                fire('videoComplete', player, video);
            }
        }
    };
};

function fire(name, id, video) {
    var remaining = 3,
        player = window.anvp[id],
        data = {
            videoContentType: player.mergedConfig.live ? 'live' : 'vod',
            videoId: video,
            videoPlayer: 'Anvato Universal Player-' + id,
            videoPlayType: player.mergedConfig.autoplay ? 'auto-play' : 'manual play',
            videoSiteAccountID: player.mergedConfig.accessKey,
            videoSource: 'Anvato',
            videoTopics: tags[video]
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
