/*global module*/

module.exports = {
    // Checks if the <title> of ´github.com´ has the expected value
    'Page title is correct': function (test) {
        'use strict';
        test
            .open('http://localhost:8888/dalekjs-crossbrowser/src/')
            .assert.title('This is the page title')
            .screenshot('test/results/index_:browser_:version.png')
            .done();
    }
};