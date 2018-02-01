module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            bundle: {
                files: {
                    'dist/cmanvato.min.js': 'bin/cmanvato.js'
                }
            }
        }
    });
};
