/*jslint node: true, nomen: true */

'use strict';

var path = require('path'),
    colors = require('colors'),
    util = require('./util');

module.exports = util.whereTheMagicHappens(
    path.dirname(global.process.mainModule.filename),
    process.env
).config;
