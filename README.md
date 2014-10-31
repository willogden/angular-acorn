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

Then open `file:///path/to/angular-acorn/dist/index.html` in your browser. Here's a [demo](http://willo.gd/en/demos/angular-acorn/index.html)

## Features

- Application structure based on Google's recent "Best Practice" [document](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)
- [Gulp](http://gulpjs.com/) for super fast task running and build automation
- [Browserify](http://browserify.org/) to handle dependency management
- [Bourbon](http://bourbon.io/) to provide some nice pure Sass mixin's
- [Susy](http://susydocs.oddbird.net/en/latest/) for great semantic grids using (Breakpoint)[http://breakpoint-sass.com/] for media query support
- [Jasmine](http://jasmine.github.io/) and [Karma](http://karma-runner.github.io/0.12/index.html)

## NEW in version 2.0.0

- Removed IE8 compatiability, use 1.0.0 branch if you need this
- Angular updated to 1.3.x
- Source maps working properly for SASS and JS with ugligfy/compressed scss
- Added normalize as SASS import rather than CSS concat
- Removed option for build or dist releases...working source maps negated need for this
