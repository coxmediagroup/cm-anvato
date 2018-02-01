module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            bundle: {
                files: {
                    'bin/cmanvato.js': 'src/anvato.js'
                },
                options: {
                    alias: {
                        jquery: './tasks/util/jquery-shim.js'
                    },
                    browserifyOptions: {
                        standalone: 'cmanvato'
                    }
                }
            }
        }
    });
};
