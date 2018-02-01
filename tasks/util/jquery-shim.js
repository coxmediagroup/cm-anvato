if (!window.jQuery && !window.$) {
    throw Error('cmAnvato ERROR: Cannot find jQuery! Library was not loaded.');
}

module.exports = window.jQuery || window.$;
