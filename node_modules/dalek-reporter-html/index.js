/*!
 *
 * Copyright (c) 2013 Sebastian Golasch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

'use strict';

// ext. libs
var Handlebars = require('handlebars');
var stylus = require('stylus');
var fs = require('fs');

// int. globals
var reporter = null;

/**
 * The HTML reporter can produce a set of HTML files with the results of your testrun.
 *
 * The reporter can be installed with the following command:
 *
 * ```bash
 * $ npm install dalek-reporter-html --save-dev
 * ```
 *
 * By default the files will be written to the `report/dalek/` folder,
 * you can change this by adding a config option to the your Dalekfile
 *
 * ```javascript
 * "html-reporter": {
 *   "dest": "your/folder"
 * }
 * ```
 *
 * If you would like to use the reporter (in addition to the std. console reporter),
 * you can start dalek with a special command line argument
 *
 * ```bash
 * $ dalek your_test.js -r console,html
 * ```
 *
 * or you can add it to your Dalekfile
 *
 * ```javascript
 * "reporter": ["console", "html"]
 * ```
 *
 * @class Reporter
 * @constructor
 * @part html
 * @api
 */

function Reporter (opts) {
  this.events = opts.events;
  this.config = opts.config;
  this.temporaryAssertions = [];
  this.temp = {};

  var defaultReportFolder = 'report/dalek';
  this.dest = this.config.get('html-reporter') && this.config.get('html-reporter').dest ? this.config.get('html-reporter').dest : defaultReportFolder;

  this.loadTemplates();
  this.initOutputHandlers();
  this.startListening();
}

/**
 * @module Reporter
 */

module.exports = function (opts) {
  if (reporter === null) {
    reporter = new Reporter(opts);
  }

  return reporter;
};

Reporter.prototype = {

  /**
   * Inits the html buffer objects
   *
   * @method initOutputHandlers
   * @chainable
   */

  initOutputHandlers: function () {
    this.output = {};
    this.output.test = {};
    return this;
  },

  /**
   * Loads and prepares all the templates for
   * CSS, JS & HTML
   *
   * @method loadTemplates
   * @chainable
   */

  loadTemplates: function () {
    // render stylesheets
    var precss = fs.readFileSync(__dirname + '/themes/default/styl/default.styl', 'utf8');
    stylus.render(precss, { filename: 'default.css' }, function(err, css){
      if (err) {
        throw err;
      }

      this.styles = css;
    }.bind(this));

    // collect client js (to be inined later)
    this.js = fs.readFileSync(__dirname + '/themes/default/js/default.js', 'utf8');

    // register handlebars helpers
    Handlebars.registerHelper('roundNumber', function (number) {
      return Math.round(number * Math.pow(10, 2)) / Math.pow(10, 2);
    });

    // collect & compile templates
    this.templates = {};
    this.templates.test = Handlebars.compile(fs.readFileSync(__dirname + '/themes/default/hbs/test.hbs', 'utf8'));
    this.templates.wrapper = Handlebars.compile(fs.readFileSync(__dirname + '/themes/default/hbs/wrapper.hbs', 'utf8'));
    this.templates.testresult = Handlebars.compile(fs.readFileSync(__dirname + '/themes/default/hbs/tests.hbs', 'utf8'));
    this.templates.banner = Handlebars.compile(fs.readFileSync(__dirname + '/themes/default/hbs/banner.hbs', 'utf8'));
    this.templates.detail = Handlebars.compile(fs.readFileSync(__dirname + '/themes/default/hbs/detail.hbs', 'utf8'));

    return this;
  },

  /**
   * Connects to all the event listeners
   *
   * @method startListening
   * @chainable
   */

  startListening: function () {
    // index page
    this.events.on('report:assertion', this.outputAssertionResult.bind(this));
    this.events.on('report:test:finished', this.outputTestFinished.bind(this));
    this.events.on('report:runner:finished', this.outputRunnerFinished.bind(this));
    this.events.on('report:run:browser', this.outputRunBrowser.bind(this));

    // detail page
    this.events.on('report:test:started', this.startDetailPage.bind(this));
    this.events.on('report:action', this.addActionToDetailPage.bind(this));
    this.events.on('report:assertion', this.addAssertionToDetailPage.bind(this));
    this.events.on('report:test:finished', this.finishDetailPage.bind(this));

    return this;
  },

  /**
   * Prepares the output for a test detail page
   *
   * @method startDetailPage
   * @chainable
   */

  startDetailPage: function () {
    this.detailContents = {};
    this.detailContents.eventLog = [];
    return this;
  },

  /**
   * Adds an action output to the detail page
   *
   * @method addActionToDetailPage
   * @param {object} data Event data
   * @chainable
   */

  addActionToDetailPage: function (data) {
    data.isAction = true;
    this.detailContents.eventLog.push(data);
    return this;
  },

  /**
   * Adds an assertion result to the detail page
   *
   * @method addAssertionToDetailPage
   * @param {object} data Event data
   * @chainable
   */

  addAssertionToDetailPage: function (data) {
    data.isAssertion = true;
    this.detailContents.eventLog.push(data);
    return this;
  },

  /**
   * Writes a detail page to the file system
   *
   * @method finishDetailPage
   * @param {object} data Event data
   * @chainable
   */

  finishDetailPage: function (data) {
    this.detailContents.testResult = data;
    this.detailContents.styles = this.styles;
    this.detailContents.js = this.js;
    fs.writeFileSync(this.dest + '/details/' + data.id + '.html', this.templates.detail(this.detailContents), 'utf8');
    return this;
  },

  /**
   * Stores the current browser name
   *
   * @method outputRunBrowser
   * @param {string} browser Browser name
   * @chainable
   */

  outputRunBrowser: function (browser) {
    this.temp.browser = browser;
    return this;
  },

  /**
   * Writes the index page to the filesystem
   *
   * @method outputRunnerFinished
   * @param {object} data Event data
   * @chainable
   */

  outputRunnerFinished: function (data) {
    var body = '';
    var contents = '';
    var tests = '';
    var banner = '';

    // add test results
    var keys = Object.keys(this.output.test);
    keys.forEach(function (key) {
      tests += this.output.test[key];
    }.bind(this));

    // compile the test result template
    body = this.templates.testresult({result: data, tests: tests});

    // compile the banner
    banner = this.templates.banner({status: data.status});

    // compile the contents within the wrapper template
    contents = this.templates.wrapper({styles: this.styles, js: this.js, banner: banner, body: body});

    // save the main test output file
    this.events.emit('report:written', {type: 'html', dest: this.dest});
    this._recursiveMakeDirSync(this.dest + '/details');
    fs.writeFileSync(this.dest + '/index.html', contents, 'utf8');
    return this;
  },

  /**
   * Pushes an assertion result to the index output queue
   *
   * @method outputAssertionResult
   * @param {object} data Event data
   * @chainable
   */

  outputAssertionResult: function (data) {
    this.temporaryAssertions.push(data);
    return this;
  },

  /**
   * Pushes an test result to the index output queue
   *
   * @method outputTestFinished
   * @param {object} data Event data
   * @chainable
   */

  outputTestFinished: function (data) {
    data.assertionInfo = this.temporaryAssertions;
    data.browser = this.temp.browser;
    this.output.test[data.id] = this.templates.test(data);
    this.temporaryAssertions = [];
    return this;
  },

  /**
   * Helper method to generate deeper nested directory structures
   *
   * @method _recursiveMakeDirSync
   * @param {string} path PAth to create
   */

  _recursiveMakeDirSync: function (path) {
    var pathSep = require('path').sep;
    var dirs = path.split(pathSep);
    var root = '';

    while (dirs.length > 0) {
      var dir = dirs.shift();
      if (dir === '') {
        root = pathSep;
      }
      if (!fs.existsSync(root + dir)) {
        fs.mkdirSync(root + dir);
      }
      root += dir + pathSep;
    }
  }
};
