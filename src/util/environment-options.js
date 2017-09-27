/**
 * Parse all url parameters into an object.
 * @returns {Object<string, string>}
 */
var params, result = {}, options = {};
var query = window.location.search;

// Remove leading '?' and split into parameters.
query = query.slice(1);
params = query.split('&');

// Construct the dictionary.
params.forEach(function (param) {
    var pair = param.split('='),
        key = pair[0],
        value = pair[1];
    // Decode value or set to true if no value.
    result[key] = value ? window.decodeURIComponent(value) : true;
});

// Parse out any Anvato settings.
if ('anvato' in result) {
    result.anvato.split('|').forEach(function (setting) {
        setting = setting.split('-');
        options[setting[0]] = setting[1] || true;
    });
}

// Provide map of player options.
module.exports = options;
