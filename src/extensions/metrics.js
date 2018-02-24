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
    }

    anvp.listener = function (event) {
        var player = anvp[event.sender];

        /**
         * Trigger any player event for non-metrics code to use.
         * Video playlists use these events.
         */
        handler.trigger(event.name, event);

        if (window.pubsub) {
            // Record player-related metrics.
            switch (event.name) {
                case 'METADATA_LOADED' :
                    anvp[event.args[1] + '-topics'] = event.args[2].tags; // wtf untangle this
                    break;
                case 'PLAYING_START':
                    // Ensure `video-start` only fires once per content.
                    if (!player.cmgVideoStart) {
                        player.cmgVideoStart = true; // untangle this
                        queuePayload(event, 'video-start', Date.now());
                    }
                    break;
                case 'VIDEO_STARTED':
                    queuePayload(event, 'video-content-play', Date.now());
                    break;
                case 'USER_PAUSE':
                    queuePayload(event, 'video-pause', Date.now());
                    break;
                case 'VIDEO_COMPLETED':
                    player.cmgVideoStart = false; // untangle this
                    queuePayload(event, 'video-complete', Date.now());
                    break;
            }
        }
    };
};

function payload_processing_complete() {
    if (queuedPayloads.length) {
        constructAnvatoPayload(
            queuedPayloads[0].event,
            queuedPayloads[0].metricEvent,
            queuedPayloads[0].ts
        );
        queuedPayloads.shift();
    }
}

function queuePayload(event, metricEvent, ts) {
    if (!payloadProcessing) {
        constructAnvatoPayload(event, metricEvent, ts);
    } else {
        queuedPayloads.push({
            event: event,
            metricEvent: metricEvent,
            ts: ts
        });
    }
}

function constructAnvatoPayload(event, metricEvent, ts) {
    payloadProcessing = true;
    videoDataRequests[ts] = {}; // This is really unacceptable.. the metrics payload is being keyed off of a fucking timestamp!?
    videoDataRequests[ts].sender = event.sender;

    // semaphore that avoids race condition with anvato async callbacks.. but this is nasty
    videoDataRequests[ts].async = ['title', 'time', 'duration'];

    videoDataRequests[ts].payload = {};
    videoDataRequests[ts].event = metricEvent;
    videoDataRequests[ts].event_fired = false; // what is this used for?

    videoDataRequests[ts].titleFunc = function (result) {
        videoDataRequests[ts].payload.videoName = result;
        pop('title', videoDataRequests[ts].async); // what does this do? something to do with the semaphore
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };

    videoDataRequests[ts].timeFunc = function (result) {
        videoDataRequests[ts].payload.videoSecondsViewed = result;
        pop('time', videoDataRequests[ts].async); // what does this do? something to do with the semaphore
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };

    videoDataRequests[ts].durationFunc = function (result) {
        videoDataRequests[ts].payload.videoTotalTime = result;
        pop('duration', videoDataRequests[ts].async); // what does this do? something to do with the semaphore
        if (videoDataRequests[ts].async.length === 0 && !videoDataRequests[ts].event_fired) {
            anvatoPayloadComplete(ts);
        }
    };
    anvp[event.sender].getTitle(videoDataRequests[ts].titleFunc);
    anvp[event.sender].getCurrentTime(videoDataRequests[ts].timeFunc);
    anvp[event.sender].getDuration(videoDataRequests[ts].durationFunc);
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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    window.pubsub.publish(videoDataRequests[ts].event, videoDataRequests[ts].payload); // the only line that does anything

    payloadProcessing = false;
    payload_processing_complete();
}

/**
 * How the "semaphore" works..
 * Theres an array of variables that require async functions to access through the
 * anvato api - these are getTitle, getCurrentTime, getTitle
 * As those async functions return:
 * - pop their names out of the array names "async"
 * - check if the "async" array is empty, if so:
 *      - check if the current payload object has been submitted, if not:
 *          - anvatoPayloadComplete()
 */
function pop(element, array) {
    var index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}
