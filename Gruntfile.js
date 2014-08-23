module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	wiredep: {
	        target: {

		    // Point to the file that should be updated when 'grunt' is run
		    src: ['client/index.html']
		}
	    }
	
    });

    grunt.loadNpmTasks('grunt-wiredep');

    // Default task(s).
    grunt.registerTask('default', ['wiredep']);

};
