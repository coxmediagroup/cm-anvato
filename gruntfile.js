module.exports = function (grunt) {
    // Load all tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [
        'jshint',
        'browserify',
        'uglify'
    ]);
};
