module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            bundle: {
                files: {
                    'bin/cmanvato.js': 'src/anvato.js'
                },
                options: {
                    // Once Browserify fixes https://github.com/jmreidy/grunt-browserify/issues/313
                    // then aliasify can be replaced with this:
                    /*alias: {
                        jquery: './tasks/util/jquery-shim.js'
                    },*/
                    browserifyOptions: {
                        standalone: 'cmanvato'
                    }
                }
            }
        }
    });
};
