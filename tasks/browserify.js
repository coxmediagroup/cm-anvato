module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            bundle: {
                files: {
                    'bin/cmanvato.js': 'src/anvato.js'
                },
                options: {
                    browserifyOptions: {
                        standalone: 'cmanvato'
                    }
                }
            }
        }
    });
};
