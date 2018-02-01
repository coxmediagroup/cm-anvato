var $ = require('jquery'),
    handler = require('../util/event-handler.js'),
    pubsub = window.pubsub,
    anvp = window.anvp = window.anvp || {};

/**
 * Bind metrics to player events.
 */
module.exports = function () {
    if (!window.pubsub) {
        console.warn('[cmAnvato] Cannot find PubSub! Video metrics are OFFLINE.');
        return;
    }

    window.videoDataRequests = [];
    window.payloadProcessing = false;
    window.queuedPayloads = [];

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

    pubsub.subscribe('payload_processing_complete', function () {
        if (window.queuedPayloads.length) {
            constructAnvatoPayload(
                window.queuedPayloads[0].e,
                window.queuedPayloads[0].metricEvent,
                window.queuedPayloads[0].ts
            );
            window.queuedPayloads.shift();
        }
    });
};

function queuePayload(e, metricEvent, ts) {
    if (!window.payloadProcessing) {
        constructAnvatoPayload(e, metricEvent, ts);
    } else {
        window.queuedPayloads.push({
            e: e,
            metricEvent: metricEvent,
            ts: ts
        });
    }
}

function constructAnvatoPayload(e, metricEvent, ts) {
    window.payloadProcessing = true;
    window.videoDataRequests[ts] = {};
    window.videoDataRequests[ts].sender = e.sender;
    window.videoDataRequests[ts].async = ['title', 'time', 'duration'];
    window.videoDataRequests[ts].payload = {};
    window.videoDataRequests[ts].event = metricEvent;
    window.videoDataRequests[ts].event_fired = false;
    window.videoDataRequests[ts].titleFunc = function (result) {
        window.videoDataRequests[ts].payload.videoName = result;
        pop('title', window.videoDataRequests[ts].async);
        if (window.videoDataRequests[ts].async.length === 0 && !window.videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    window.videoDataRequests[ts].timeFunc = function (result) {
        window.videoDataRequests[ts].payload.videoSecondsViewed = result;
        pop('time', window.videoDataRequests[ts].async);
        if (window.videoDataRequests[ts].async.length === 0 && !window.videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    window.videoDataRequests[ts].durationFunc = function (result) {
        window.videoDataRequests[ts].payload.videoTotalTime = result;
        pop('duration', window.videoDataRequests[ts].async);
        if (window.videoDataRequests[ts].async.length === 0 && !window.videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    anvp[e.sender].getTitle(window.videoDataRequests[ts].titleFunc);
    anvp[e.sender].getCurrentTime(window.videoDataRequests[ts].timeFunc);
    anvp[e.sender].getDuration(window.videoDataRequests[ts].durationFunc);
}

function anvatoPayloadComplete(ts) {
    var sender = window.videoDataRequests[ts].sender;
    window.videoDataRequests[ts].event_fired = true;
    window.videoDataRequests[ts].payload.videoId = anvp[sender].mergedConfig.video;
    window.videoDataRequests[ts].payload.videoTopics = anvp[anvp[sender].mergedConfig.video + '-topics'];
    window.videoDataRequests[ts].payload.videoPlayer = 'Anvato Universal Player-' + anvp[sender].mergedConfig.pInstance;
    window.videoDataRequests[ts].payload.videoSiteAccountID = anvp[sender].mergedConfig.accessKey;
    window.videoDataRequests[ts].payload.videoPlayType = anvp[sender].mergedConfig.autoplay ? 'auto-play' : 'manual play';
    window.videoDataRequests[ts].payload.videoSource = 'Anvato';
    window.videoDataRequests[ts].payload.videoContentType = anvp[sender].mergedConfig.live ? 'live' : 'vod';
    pubsub.publish(window.videoDataRequests[ts].event, window.videoDataRequests[ts].payload);
    window.payloadProcessing = false;
    pubsub.publish('payload_processing_complete');
}

function pop(element, array) {
    var index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}
