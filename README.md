angular-acorn
=============

AngularJS seed project using Browserify, Bourbon, Susy, and Gulp. Inspired by [ngBoilerplate](http://joshdmiller.github.com/ng-boilerplate).

## Installation

Install [npm](https://github.com/npm/npm) then:

```sh
$ git clone https://github.com/willogden/angular-acorn.git
$ cd angular-acorn
$ sudo npm -g install gulp bower
$ npm install
$ bower install
$ gulp build
```

Then open `file:///path/to/angular-acorn/build/index.html` in your browser.

## Features

- Application structure based on Google's recent "Best Practice" [document](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub) 
- Currently IE8 compatible (using [HTML5Shiv](https://code.google.com/p/html5shiv/) for HTML5 element support) 
- [Gulp](http://gulpjs.com/) for super fast task running and build automation
- [Browserify](http://browserify.org/) to handle dependency management
- [Bourbon](http://bourbon.io/) to provide some nice pure Sass mixin's
- [Susy](http://susydocs.oddbird.net/en/latest/) for great semantic grids using (Breakpoint)[http://breakpoint-sass.com/] for media query support
- [Jasmine](http://jasmine.github.io/) and [Karma](http://karma-runner.github.io/0.12/index.html)
