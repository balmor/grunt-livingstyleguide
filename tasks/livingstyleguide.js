/*
 * grunt-livingstyleguide
 * https://github.com/NexwayGroup/grunt-livingstyleguide
 *
 * Copyright (c) 2015 Nexway Lab.
 * Licensed under the MIT license.
 *
 * @author Damian Duda <dduda@nexway.com>
 */

'use strict';

var path  = require('path'),
    which = require('which');

module.exports = function (grunt) {

  var MODULE_NAME     = 'livingstyleguide',
      MODULE_DESC     = 'Easily create living style guides/front-end style guides/pattern libraries by adding Markdown documentation to your Sass project.',
      NEW_LINE        = '\n';

  grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var done     = this.async(),
        options  = this.options({
          dest: 'docs/styleguide.html'
        }),
        command = 'livingstyleguide',
        compile  = 'compile';

    // Check if the livingstyleguide is installed
    try {
      which.sync('livingstyleguide');
    } catch (err) {
      return grunt.log.error(
        NEW_LINE + 'You need to have livingstyleguide installed and in your PATH for this task to work.' + NEW_LINE + 'sudo gem install livingstyleguide' + NEW_LINE
      );
    }

    // Check if bundleExec is true
    if (options.bundleExec) {
      command = "bundle exec " + command;
    }

    this.files.forEach(function(file) {
      file.src.filter(function(filepath) {
        var livingProcess = {
          cmd: command,
          args: [compile, filepath]
        };
        var livingDone = function(error, result, code) {
          if (result.stdout) {
            grunt.log.ok(String(result));
          }
          if (error) {
            return done(error);
          } else {
            return done();
          }
        };
        grunt.log.writeln('\'' + command + ' ' + compile + ' ' + filepath + '\'');
        // Run livingstyleguide
        grunt.util.spawn(livingProcess, livingDone);

        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          console.log(filepath);
          // console.log(dest);
          return true;
        }
      });
    });

  });
};
