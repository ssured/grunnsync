# Grunn-sync

This is a demo app for a GrunnJS talk on synced databases on Feb 18th 2015.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* install couchdb or open an account on iriscouch.com
* allow CORS access to your CouchDB https://github.com/pouchdb/add-cors-to-couchdb

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit the app at [http://localhost:4200](http://localhost:4200).

## Building

* `ember build` (development)
* `ember build --environment production` (production)
* `cd dist && python -m SimpleHTTPServer` to run a simple HTTP server

# How this project was crafted

* `ember new GrunnSync`
* Upgrade project to Ember 1.10 see https://github.com/rwjblue/components-in-subdirs/commit/78e7ed2d072f42d9cf0fd3d9fc2376f106ab762e
* `npm install && bower install`
* Load and import PouchDB: `ember install:bower pouchdb` and in the Brocfile.js: `app.import('bower_components/pouchdb/dist/pouchdb.js');`
* `ember install:addon ember-bootstrap` for a 'nice' UI
* `ember install:addon broccoli-manifest` for offline page support
* `ember install:addon ember-cli-fastclick` for click events on iOS
* `ember generate service connection`
* `ember generate service session`
* `ember generate service pouchdb`
