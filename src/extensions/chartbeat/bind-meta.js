/**
 * Bind player events to populate the "cmg" metadata object used
 * by the AnvatoStrategy constructor.
 */
module.exports = function (player) {
    // Metadata object used by the Strategy.
    player.cmg = {
        ready: false,
        contentType: 'ct',
        currentTime: 0
    };

    player.on('ready', function () {
        // Attempt to keep currentTime fresh.
        window.setInterval(function () {
            player.getCurrentTime(function (time) {
                // Value in milliseconds.
                player.cmg.currentTime = time * 1000;
            });
        }, 500);
    });
    player.on('METADATA_LOADED', function (id, upid, meta) {
        player.cmg.firstplay = player.cmg.firstplay === void(0);
        player.cmg.ready = true;
        player.cmg.startTime = false;
        player.cmg.contentStartTime = false;
        player.cmg.state = id === player.cmg.video ? 's4' : 's1';
        player.cmg.video = id;
        player.cmg.title = meta.title;
        player.cmg.duration = meta.duration;
        player.cmg.thumbnail = meta.thumbnail;
    });
    player.on('AD_STARTED', function () {
        player.cmg.contentType = 'ad';
        player.cmg.state = 's2';
    });
    player.on('VIDEO_STARTED', function () {
        player.cmg.contentType = 'ct';
        player.cmg.contentStartTime = performance.now();
    });
    player.on('VIDEO_COMPLETED', function () {
        player.cmg.state = 's4';
    });
    player.on('PLAYING_START', function () {
        player.cmg.state = 's2';
        if (!player.cmg.startTime) {
            player.cmg.startTime = performance.now();
        }
    });
    player.on('USER_PAUSE', function () {
        player.cmg.state = 's3';
    });
    player.on('USER_RESUME', function () {
        player.cmg.state = 's2';
    });
    player.on('CLIENT_BANDWIDTH', function (bandwidth) {
        player.cmg.bandwidth = bandwidth;
    });
};
