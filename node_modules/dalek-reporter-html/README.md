dalek-reporter-html
======================

> DalekJS reporter plugin for html output

[![Build Status](https://travis-ci.org/dalekjs/dalek-reporter-html.png)](https://travis-ci.org/dalekjs/dalek-reporter-html)
[![Build Status](https://drone.io/github.com/dalekjs/dalek-reporter-html/status.png)](https://drone.io/github.com/dalekjs/dalek-reporter-html/latest)
[![Dependency Status](https://david-dm.org/dalekjs/dalek-reporter-html.png)](https://david-dm.org/dalekjs/dalek-reporter-html)
[![devDependency Status](https://david-dm.org/dalekjs/dalek-reporter-html/dev-status.png)](https://david-dm.org/dalekjs/dalek-reporter-html#info=devDependencies)
[![NPM version](https://badge.fury.io/js/dalek-reporter-html.png)](http://badge.fury.io/js/dalek-reporter-html)
[![Coverage](http://dalekjs.com/package/dalek-reporter-html/master/coverage/coverage.png)](http://dalekjs.com/package/dalek-reporter-html/master/coverage/index.html)
[![unstable](https://rawgithub.com/hughsk/stability-badges/master/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

[![NPM](https://nodei.co/npm/dalek-reporter-html.png)](https://nodei.co/npm/dalek-reporter-html/)
[![NPM](https://nodei.co/npm-dl/dalek-reporter-html.png)](https://nodei.co/npm/dalek-reporter-html/)

## Ressources

[API Docs](http://dalekjs.com/package/dalek-reporter-html/master/api/index.html) -
[Trello](https://trello.com/b/OU9sxdtw/dalek-reporter-html) -
[Code coverage](http://dalekjs.com/package/dalek-reporter-html/master/coverage/index.html) -
[Code complexity](http://dalekjs.com/package/dalek-reporter-html/master/complexity/index.html) -
[Contributing](https://github.com/dalekjs/dalek-reporter-html/blob/master/CONTRIBUTING.md) -
[User Docs](http://dalekjs.com/docs/html.html) -
[Homepage](http://dalekjs.com) -
[Twitter](http://twitter.com/dalekjs)

## Docs

The HTML reporter can produce a set of HTML files with the results of your testrun.

The reporter can be installed with the following command:

```bash
$ npm install dalek-reporter-html --save-dev
```

By default the files will be written to the `report/dalek/` folder,
you can change this by adding a config option to the your Dalekfile

```javascript
"html-reporter": {
  "dest": "your/folder"
}
```

If you would like to use the reporter (in addition to the std. console reporter),
you can start dalek with a special command line argument

```bash
$ dalek your_test.js -r console,html
```

or you can add it to your Dalekfile

```javascript
  "reporter": ["console", "html"]
```

## Help Is Just A Click Away

### #dalekjs on FreeNode.net IRC

Join the `#daleksjs` channel on [FreeNode.net](http://freenode.net) to ask questions and get help.

### [Google Group Mailing List](https://groups.google.com/forum/#!forum/dalekjs)

Get announcements for new releases, share your projects and ideas that are
using DalekJS, and join in open-ended discussion that does not fit in
to the Github issues list or StackOverflow Q&A.

**For help with syntax, specific questions on how to implement a feature
using DalekJS, and other Q&A items, use StackOverflow.**

### [StackOverflow](http://stackoverflow.com/questions/tagged/dalekjs)

Ask questions about using DalekJS in specific scenarios, with
specific features. For example, help with syntax, understanding how a feature works and
how to override that feature, browser specific problems and so on.

Questions on StackOverflow often turn in to blog posts or issues.

### [Github Issues](//github.com/dalekjs/dalek-reporter-html/issues)

Report issues with DalekJS, submit pull requests to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).

**Please don't ask questions or seek help in the issues list.** There are
other, better channels for seeking assistance, like StackOverflow and the
Google Groups mailing list.

![DalekJS](https://raw.github.com/dalekjs/dalekjs.com/master/img/logo.png)

## Legal FooBar (MIT License)

Copyright (c) 2013 Sebastian Golasch

Distributed under [MIT license](https://github.com/dalekjs/dalek-reporter-html/blob/master/LICENSE-MIT)

