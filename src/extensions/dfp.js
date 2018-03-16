var cmg = require('./cmg.js'),
    options = require('../util/environment-options.js');

/**
 * # buildAdConfig()
 * Builds new ad targeting for the current video.
 * @param {object} video Anvato metadata.
 * @param {string} id Player's HTML id.
 * @param {string} cmsid CMS id used for ad content targeting.
 * @param {integer} [dfpTimeout] Optional time in seconds for pre-roll timeout override.
 * @param {string|array<string>} vpxTopics Topics of the vpx object.
 * @param {string|array<string>} vpxCategories Categories of the vpx object.
 * @return {object} New DFP plugin config.
 */
module.exports = function (video, id, cmsid, adtag, dfpTimeout, vpxTopics, vpxCategories) {
    var config;

    if (!cmg.adconf.adunit) {
        console.warn('[cmAnvato] Cannot find cm-ads! Video ad targeting is OFFLINE.');
        return;
    }

    // Merge all topics.
    var topics = [].concat(
        cmg.adconf.targeting.topics,
        vpxTopics,
        video.tags
    ).toString();

    // Merge all categories.
    var categories = [].concat(
        cmg.adconf.targeting.categories,
        vpxCategories,
        video.categories
    ).toString();

    // Build the new DFP plugin config.
    // TODO: These overrides need cleanup.
    var startTimeout = dfpTimeout || 20;
    config = {
        startTimeout: 'startTimeout' in options ? parseInt(options.startTimeout) : startTimeout,
        vastLoadTimeout: 'vastLoadTimeout' in options ? parseInt(options.vastLoadTimeout) : 10,
        loadVideoTimeout: 'loadVideoTimeout' in options ? parseInt(options.loadVideoTimeout) : 10,
        adTagUrl: adtag,
        keyValues: {
            category: categories,
            video: video.upload_id,
            owner_id: video.owner_id,
            kw: topics,
            topics: topics,
            weather: cmg.adconf.targeting.weather,
            temp_range: cmg.adconf.targeting.temp_range,
            sky: cmg.adconf.targeting.sky,
            obj_type: cmg.adconf.targeting.obj_type,
            obj_id: cmg.adconf.targeting.obj_id,
            uuid: cmg.adconf.targeting.uuid,
            player_id: id,
            environ: cmg.adconf.targeting.environ
        },
        macros: {
            adunit: cmg.adconf.adunit,
            cmsid: cmsid,
            vid: 'ANV_ANV_' + video.upload_id,
            referrer_url: window.location.href
        }
    };

    // Log this video's ad targeting for traffickers to use.
    console.info(
        '\n/-------- VIDEO AD TARGETING --------/\n' +
        video.def_title + '\n' +
        JSON.stringify(config.keyValues, null, 3) + '\n' +
        ' - Anvato MCP:\n\t[TAGS] ' + video.tags + '\n' +
        '\t[CATEGORIES] ' + video.categories + '\n' +
        ' - Methode VPX:\n\t[TOPICS] ' + vpxTopics + '\n' +
        '\t[CATEGORIES] ' + vpxCategories + '\n' +
        ' - Methode PAGE:\n\t[TOPICS] ' + cmg.adconf.targeting.topics + '\n' +
        '\t[CATEGORIES] ' + cmg.adconf.targeting.categories
    );

    // Return the new ad targeting.
    return config;
};
