/*jslint node: true, nomen: true */

'use strict';

var path = require('path'),
    merge = require('merge-recursive').recursive,
    util = require('./util');

var config = util.whereTheMagicHappens(
    path.dirname((
        global.process.mainModule &&
        global.process.mainModule.filename
    ) || process.cwd()),
    process.env
).config;

function figs(bundle, b) {
    var subset;
    /**
     * This is cheeky, but I'm attempting to detect if this was called by
     * browserify.
     */
    if (bundle === b && bundle instanceof Function && bundle.wrap instanceof Function) {
        subset = config;
    } else {
        subset = util.whitelist(config, bundle || {});
    }
    return util.browserify('/node_modules/figs/index.js', subset);
}

module.exports = merge(figs, config);
