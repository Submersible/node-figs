/*jslint node: true, nomen: true, regexp: true, stupid: true */

'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    merge = require('merge-recursive').recursive;

var util = {};

/* A valid ENV name to override a config property */
var MATCH_ENV_NAME = /^CONFIG_.*$/;

/**
 * Create a browserify plugin that mounts data to a path in the bundle.
 * @param {String} mount Path to mount as in Browserify
 * @param data Value to serialize into the browserify module
 * @return {Function} Browserify middleware
 */
util.browserify = function (mount, data) {
    return function (bundle) {
        bundle.include(
            path.join(mount),
            undefined,
            'module.exports = ' + JSON.stringify(data) + ';'
        );
    };
};

/**
 * Find existing configs from root path.
 * @param {String} root Root path
 * @param {Array<String>} configs Files to find
 * @return {Array<String>} Absolute files that exist
 */
util.findConfigs = function (path, configs) {
    return util.possibleFiles(path, configs).filter(fs.existsSync);
};

/**
 * Build config from env & root directory
 * @param {String} root Root path
 * @param {HashMap<String, String>} env Environment variables
 * @param {Object} Config!
 */
util.whereTheMagicHappens = function (root, env) {
    /* Load the configs */
    var files = [], envs = [];

    /* 1. Inheritance */
    files = files.concat(util.findConfigs(root, ['config.local.js', 'config.local.json', 'config.js', 'config.json']));

    /* 2. Clobbering */
    files = files.concat(util.findConfigs(root, ['clobber.js', 'clobber.json']).reverse());

    /* 3. Load passed in config */
    if (env.CONFIG && fs.existsSync(env.CONFIG)) {
        files.push(process.env.CONFIG);
    }

    /* Require files */
    files = files.map(function (file) {
        return [file, require(file)];
    });

    /* 4. Override with the ENV vars */
    envs = util.envFilter(env);

    /* Compile config */
    return {
        files: files,
        envs: envs,
        config: util.merge(files.map(function (config) {
            return config[1];
        }).concat([util.envObject(env)]))
    };
};

/**
 * Returns files mapped across every parent directory.
 * @param {String} dir Root directory
 * @param {Array<String>} files Possible files
 * @return {Array<String>} All possible locations for the files
 */
util.possibleFiles = function (dir, files) {
    var paths = [];
    /* We'll get stuck in an infinite loop if we don't resolve a relative path */
    if (dir !== path.resolve('/', dir)) {
        throw new Error('Must pass in an absolute path');
    }
    if (!(files instanceof Array)) {
        files = [files];
    }

    /* Files at the end of the list take higher precedence */
    files = files.reverse();

    while (true) {
        paths = paths.concat(files.map(_.partial(path.join, dir)));
        /* Can't go back anymore, we're done! */
        if (dir === '/') {
            break;
        }
        dir = path.join(dir, '..');
    }
    return paths;
};

/**
 * Maps an ENV variable to an object.
 * @param {String} key ENV's name
 * @param {String} value ENV's value
 * @return {Object} The ENV variable mapped to an object
 */
util.envToObject = function (key, value) {
    var obj = {},
        last = obj,
        parts = key.substr(7).split('__');

    if (value === 'true') {
        value = true;
    } else if (value === 'false') {
        value = false;
    } else if (!isNaN(Number(value))) {
        value = Number(value);
    }

    parts.forEach(function (part, index) {
        /* Sorry!  I couldn't help myself :) */
        last = (last[part] = (index < parts.length - 1) ? {} : value);
    });
    return obj;
};

/**
 * Returns the overriding variables from our environment variables.
 * @param {Object} env An object representing our environment variables
 * @return {Array<Tuple<String, String>>} Filtered ENVs 
 */
util.envFilter = function (env) {
    return _.map(env, function (value, key) {
        return [key, value];
    }).filter(function (set) {
        return MATCH_ENV_NAME.test(set[0]);
    });
};

/**
 * Deal with messy calling of the merge function.
 *
 * @param {Array<Object} objs Array of objects to merge
 * @return {Object} Merged objects
 *
 * @param {Object} obj noop
 * @return {Object} noop
 *
 * @return {Object} noop
 */
util.merge = function (objs) {
    return merge.apply(undefined, [{}].concat(objs));
};

/**
 * Takes a filtered env list and builds an object!
 * @param {Array<Tuple<String, String>>} env Filtered ENVs
 * @return {Object} Object built from ENVs
 */
util.envObject = function (env) {
    return util.merge(util.envFilter(env).map(function (args) {
        return util.envToObject(args[0], args[1]);
    }));
};

module.exports = util;
