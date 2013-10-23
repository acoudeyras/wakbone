'use strict';
var tests = [];
/*jshint camelcase:false */
Object.keys(window.__karma__.files).forEach(function(file) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      console.log('Loading test file: ' + file);
      tests.push(file);
    }
  }
});

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/app/scripts',

  paths: {
    'jquery': '../bower_components/jquery/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'backbone': '../bower_components/backbone/backbone',
    'test-helpers': '../../test/spec/test-helpers',
    'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
    moment: '../bower_components/moment/min/moment-with-langs'
  },

  shim: {
    'underscore': {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery']
    },
    'underscore.string': {
      deps: ['underscore']
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});