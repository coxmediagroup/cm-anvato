var Strategy = require('./strategy.js');

/**
 * @see http://support.chartbeat.com/docs/video.html#jssdk
 */
module.exports = function () {
    // Install the chartbeat Strategy object.
    window._cbv_strategies = window._cbv_strategies || [];
    window._cbv_strategies.push(Strategy);

    // Set Chartbeat config.
    var host = window.location.hostname,
        start = host.lastIndexOf('.', host.lastIndexOf('.') - 1);

    window._sf_async_config = window._sf_async_config || {};

    window._sf_async_config.autoDetect = false;
    window._sf_async_config.domain = host.substring(start + 1);
    window._sf_async_config.uid = (/ajc.com$/.test(host)) ? 66001 : 66065;
    window._sf_async_config.useCanonical = true;

    window._sf_endpt = window.Date.now();

    // Load the Chartbeat script.
    var script = document.createElement('script');
    script.src = 'https://static.chartbeat.com/js/chartbeat_video.js';
    document.body.appendChild(script);
};
