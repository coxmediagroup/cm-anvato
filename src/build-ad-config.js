/**
 * # buildAdConfig()
 * Builds new ad targeting for the current video.
 * @param {object} video Anvato metadata.
 * @param {string} id Player's HTML id.
 * @param {string|array<string>} vpxTopics Topics of the vpx object.
 * @param {string|array<string>} vpxCategories Categories of the vpx object.
 * @return {object} New DFP plugin config.
 */
module.exports = function (video, id, vpxTopics, vpxCategories) {
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
        video.categories.join(',')
    ).toString();

    // Build the new DFP plugin config.
    var config = {
        adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=[adunit]&gdfp_req=1&env=vp&output=vast&description_url=[referrer_url]&content_page_url=[referrer_url]&vid=[vid]&cmsid=[cmsid]',
        keyValues: {
            category: categories,
            video: video.upload_id,
            'owner_id': video.owner_id,
            kw: topics,
            topics: topics,
            weather: cmg.adconf.targeting.weather,
            'temp_range': cmg.adconf.targeting.temp_range,
            sky: cmg.adconf.targeting.sky,
            'obj_type': cmg.adconf.targeting.obj_type,
            'obj_id': cmg.adconf.targeting.obj_id,
            uuid: cmg.adconf.targeting.uuid,
            'player_id': id,
            environ: cmg.adconf.targeting.environ
        },
        macros: {
            adunit: cmg.adconf.adunit,
            cmsid: cmg.anvatoConf.cmsid,
            vid: 'ANV_ANV_' + video.upload_id,
            'referrer_url': window.location.href
        }
    };

    // Log this video's ad targeting for traffickers to use.
    console.info(
        '\n/-------- VIDEO AD TARGETING --------/\n' +
        ' - ' + video.def_title + '\n' +
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
