var postscribe = require('postscribe'),
    $ = require('jquery');

/**
 * @param {string} id Player's HTML id.
 */
module.exports = function (id) {
    // Create the script element.
    var script = document.createElement('script');
    script.setAttribute('data-anvp', JSON.stringify({
        pInstance: id
    }));
    script.src = 'https://w3.cdn.anvato.net/player/prod/v3/scripts/anvload.js';

    /**
     * Write the script to the DOM. Special scrubbing required to support postscribe.
     * @see https://github.com/coxmediagroup/cm-anvato/issues/1
     */
    $(function () {
        postscribe(document.body, script.outerHTML, {
            beforeWriteToken: function (token) {
                var anvp;
                if (token && token.attrs) {
                    anvp = token.attrs['data-anvp'];
                    if (anvp) {
                        anvp = anvp.replace(/(&quot\;)/g, '"');
                        token.attrs['data-anvp'] = anvp;
                    }
                }
                return token;
            },
            error: function (err) {
                console.error('!!!!!\tVIDEO ERROR:', err);
            }
        });
    });
};
