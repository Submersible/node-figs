/*jslint node: true, nomen: true */

'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    merge = require('merge-recursive').recursive;

var util = {};

/* A valid ENV name to override a config property */
var MATCH_ENV_NAME = /^CONFIG_.*$/;

/**
 * Build config from env & root directory
 * @param {String} root Root path
 * @param {HashMap<String, String>} env Environment variables
 * @param {Object} Config!
 */
util.whereTheMagicHappens = function (root, env) {
    function findConfigs(path, configs) {
        return util.possibleFiles(path, configs).filter(fs.existsSync);
    }

    function loadParentConfigs(path, configs) {
        return util.merge(findConfigs(path, configs).map(require));
    }

    /* Load the configs */
    var files = [], envs = [];

    /* 1. By directory */
    files = files.concat(findConfigs(root, ['config.js', 'config.json']));

    /* 2. By directory */
    files = files.concat(findConfigs(root, ['config.local.js', 'config.local.json']));

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
 * Returns files mapped acrossed every parent directory.
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
    if (!files instanceof Array) {
        files = [files];
    }
    while (true) {
        paths = paths.concat(files.map(function (file) {
            return path.join(dir, file);
        }));
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
        return [key, value]
    }).filter(function (set) {
        return MATCH_ENV_NAME.test(set[0]);
    });
};

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
