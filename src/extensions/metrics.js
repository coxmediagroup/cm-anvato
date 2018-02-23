var handler = require('../util/event-handler.js'),
    anvp = window.anvp = window.anvp || {},
    videoDataRequests = [],
    payloadProcessing = false,
    queuedPayloads = [];

/**
 * Bind metrics to player events.
 */
module.exports = function () {
    if (!window.pubsub) {
        console.warn('[cmAnvato] Cannot find PubSub! Video metrics are OFFLINE.');
        return;
    }

    anvp.listener = function (e) {
        var player = anvp[e.sender];

        /**
         * Trigger any player event for non-metrics code to use.
         * Video playlists use these events.
         */
        handler.trigger(e.name, e);

        // Record player-related metrics.
        switch (e.name) {
            case 'METADATA_LOADED' :
                if (e.args.hasOwnProperty(2)) {
                    if (e.args[2].hasOwnProperty('tags')) {
                        anvp[e.args[1] + '-topics'] = e.args[2].tags;
                    }
                }
                break;
            case 'PLAYING_START':
                // Ensure `video-start` only fires once per content.
                if (!player.cmgVideoStart) {
                    player.cmgVideoStart = true;
                    queuePayload(e, 'video-start', Date.now());
                }
                break;
            case 'VIDEO_STARTED':
                queuePayload(e, 'video-content-play', Date.now());
                break;
            case 'USER_PAUSE':
                queuePayload(e, 'video-pause', Date.now());
                break;
            case 'VIDEO_COMPLETED':
                player.cmgVideoStart = false;
                queuePayload(e, 'video-complete', Date.now());
                break;
        }
    };
};

function payload_processing_complete() {
    if (queuedPayloads.length) {
        constructAnvatoPayload(
            queuedPayloads[0].e,
            queuedPayloads[0].metricEvent,
            queuedPayloads[0].ts
        );
        queuedPayloads.shift();
    }
}

function queuePayload(e, metricEvent, ts) {
    if (!payloadProcessing) {
        constructAnvatoPayload(e, metricEvent, ts);
    } else {
        queuedPayloads.push({
            e: e,
            metricEvent: metricEvent,
            ts: ts
        });
    }
}

function constructAnvatoPayload(e, metricEvent, ts) {
    payloadProcessing = true;
    videoDataRequests[ts] = {};
    videoDataRequests[ts].sender = e.sender;
    videoDataRequests[ts].async = ['title', 'time', 'duration'];
    videoDataRequests[ts].payload = {};
    videoDataRequests[ts].event = metricEvent;
    videoDataRequests[ts].event_fired = false;
    videoDataRequests[ts].titleFunc = function (result) {
        videoDataRequests[ts].payload.videoName = result;
        pop('title', videoDataRequests[ts].async);
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    videoDataRequests[ts].timeFunc = function (result) {
        videoDataRequests[ts].payload.videoSecondsViewed = result;
        pop('time', videoDataRequests[ts].async);
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    videoDataRequests[ts].durationFunc = function (result) {
        videoDataRequests[ts].payload.videoTotalTime = result;
        pop('duration', videoDataRequests[ts].async);
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    anvp[e.sender].getTitle(videoDataRequests[ts].titleFunc);
    anvp[e.sender].getCurrentTime(videoDataRequests[ts].timeFunc);
    anvp[e.sender].getDuration(videoDataRequests[ts].durationFunc);
}

function anvatoPayloadComplete(ts) {
    var sender = videoDataRequests[ts].sender;
    videoDataRequests[ts].event_fired = true;
    videoDataRequests[ts].payload.videoId = anvp[sender].mergedConfig.video;
    videoDataRequests[ts].payload.videoTopics = anvp[anvp[sender].mergedConfig.video + '-topics'];
    videoDataRequests[ts].payload.videoPlayer = 'Anvato Universal Player-' + anvp[sender].mergedConfig.pInstance;
    videoDataRequests[ts].payload.videoSiteAccountID = anvp[sender].mergedConfig.accessKey;
    videoDataRequests[ts].payload.videoPlayType = anvp[sender].mergedConfig.autoplay ? 'auto-play' : 'manual play';
    videoDataRequests[ts].payload.videoSource = 'Anvato';
    videoDataRequests[ts].payload.videoContentType = anvp[sender].mergedConfig.live ? 'live' : 'vod';
    window.pubsub.publish(videoDataRequests[ts].event, videoDataRequests[ts].payload);
    payloadProcessing = false;
    payload_processing_complete();
}

function pop(element, array) {
    var index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}
