module.exports = function (grunt) {
    // Load all tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('methode-publishing');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [
        'jshint',
        'browserify',
        'uglify'
    ]);
    grunt.registerTask('build', [
        'browserify',
        'uglify'
    ]);
};
