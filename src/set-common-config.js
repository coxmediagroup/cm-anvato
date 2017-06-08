var mergeLeft = require('./util/map-merge-left.js'),
    anvp = window.anvp = window.anvp || {},
    DDO = window.DDO,
    cmg = window.cmg || {};
anvp.common = anvp.common || {};
cmg.anvatoConf = cmg.anvatoConf || {};

/**
 * Create the common config object. Shallow merges in any existing settings
 * that have already been applied to the global anvp object.
 */
anvp.common.config = mergeLeft({
    accessKey: cmg.anvatoConf.accessKey,
    token: ' ',
    width: '100%',
    height: '56.25%',
    mcp: 'anv',
    autoplay: false,
    volume: 0.5,
    recom: true,
    plugins: {
        comscore: {
            clientId: 6035944
        }
    },
    profile: 'cox'
}, anvp.common.config);

// Create the customMetadata object if the metrics object is available.
if (DDO && DDO.pageData && DDO.siteData && DDO.contentData) {
    anvp.common.config.customMetadata = {
        video: {
            pageName: DDO.pageData.pageName,
            pageSiteSection: DDO.pageData.pageSiteSection,
            pageCategory: DDO.pageData.pageCategory,
            pageSubCategory: DDO.pageData.pageSubCategory,
            pageContentType: DDO.pageData.pageContentType,
            pageTitle: DDO.pageData.pageTitle,
            siteVersion: DDO.siteData.siteVersion,
            siteDomain: DDO.siteData.siteDomain,
            siteFormat: DDO.siteData.siteFormat,
            siteMetro: DDO.siteData.siteMetro,
            siteMedium: DDO.siteData.siteMedium,
            siteID: DDO.siteData.siteID,
            siteType: DDO.siteData.siteType,
            siteCMS: DDO.siteData.siteCMS,
            contentTopics: DDO.contentData.contentTopics,
            contentByline: DDO.contentData.contentByline,
            contentID: DDO.contentData.contentID,
            contentVendor: DDO.contentData.contentVendor
        },
        chapter: {},
        ad: {}
    };
}
