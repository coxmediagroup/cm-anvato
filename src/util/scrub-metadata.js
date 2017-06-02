/**
 * # scrubMetadata()
 * The metadata object provided by Anvato is inconsistent, so set default and
 * fallback values to abstract the issue away from the rest of the module.
 * @param {object} video Metadata object provided by the `onBeforeVideoLoad` callback.
 * @return {object}
 */
module.exports = function (video) {
    video.tags = video.tags || [];
    video.categories = video.categories || [];
    video.upload_id = video.upload_id || video.id || 'ERROR';
    video.owner_id = video.owner_id || 'ERROR';
    return video;
};
