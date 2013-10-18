'use strict';

var expect = require('chai').expect;

describe('dalek-reporter-html', function() {

  it('should be ok', function(){
    var HtmlReporter = require('../index')({
      events: {emit: function () {}, on: function () {}, off: function () {}},
      config: {get: function () {}}
    });
    expect(HtmlReporter).to.be.ok;
  });

});
