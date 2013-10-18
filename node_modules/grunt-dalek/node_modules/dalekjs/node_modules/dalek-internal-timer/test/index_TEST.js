'use strict';

var expect = require('chai').expect;
var Timer = require('../index.js');

describe('dalek-internal-timer', function() {

  it('should exist', function() {
    var timer = new Timer();
    expect(timer).to.be.ok;
  });

});
