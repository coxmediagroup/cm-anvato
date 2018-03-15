module.exports = function (player) {
    var meta = player.cmg;

    return {
        isReady: function () {
            return meta.ready;
        },
        getTitle: function () {
            return meta.title;
        },
        getVideoPath: function () {
            return meta.video;
        },
        getContentType: function () {
            return meta.contentType;
        },
        getAdPosition: function () {
            return 'a1';
        },
        getTotalDuration: function () {
            return meta.duration * 1000;
        },
        getState: function () {
            return meta.state;
        },
        getCurrentPlayTime: function () {
            return Math.floor(meta.currentTime);
        },
        getBitrate: function () {
            return Math.floor(meta.bandwidth) || 0;
        },
        getThumbnailPath: function () {
            return meta.thumbnail;
        },
        getPlayerType: function () {
            return 'VideoPlayer/Single';
        },
        getViewStartTime: function () {
            if (meta.startTime) {
                return Math.floor(performance.now() - meta.startTime);
            }
            return 0;
        },
        getStrategyName: function () {
            return 'AN';
        },
        getAutoplayType: function () {
            if (meta.firstplay) {
                return player.mergedConfig.autoplay ? 'auto' : 'man';
            }
            return 'cont';
        }
    };
};

module.exports.verify = function (player) {
    try {
        return player.mergedConfig.baseURL.indexOf('cdn.anvato.net') >= 0;
    } catch (err) {
        return false;
    }
};
