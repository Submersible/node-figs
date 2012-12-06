#!/usr/bin/env node
/*jslint node: true, nomen: true */

'use strict';

var path = require('path'),
    nutil = require('util'),
    colors = require('colors'),
    optimist = require('optimist'),
    util = require('./util');

var argv = optimist
    .usage('Use: figs [-opts] [directory]\n\n' +
        'Arguments:\n' +
        '  directory   inspect from the specified directory')
    .boolean(['h', 'l', 'v', 'j'])
    .alias('h', 'help')
    .alias('l', 'list')
    .alias('v', 'view')
    .alias('j', 'json')
    .describe('help', 'this message')
    .describe('list', 'all configs in the inheritance chain')
    .describe('view', 'full stack trace of all the configs & contents')
    .describe('json', 'View the raw JSON')
    .argv;

var root = process.cwd(),
    show_colors = true;

function color(str, c) {
    if (show_colors) {
        return str[c];
    }
    return str;
}

if (argv._[0]) {
    root = path.resolve(root, argv._[0]);
}

var out = util.whereTheMagicHappens(root, process.env);

if (argv.h) {
    optimist.showHelp();
} else if (argv.l) {
    console.log(color('[Root]  ', 'magenta'), root);

    out.files.forEach(function (file) {
        console.log(color('[Loaded]', 'green'), file[0]);
    });

    out.envs.forEach(function (env) {
        console.log(color('[Env]   ', 'blue'), env[0]);
    });
} else if (argv.v) {
    console.log(color('[Root]  ', 'magenta'), root);

    out.files.forEach(function (file) {
        console.log(color('[Loaded]', 'magenta'), file[0]);
        console.log(nutil.inspect(file[1], true, null, show_colors) + '\n\n');
    });

    out.envs.forEach(function (env) {
        console.log(
            color('[Env]   ', 'magenta'),
            env[0] + '=' + nutil.inspect(env[1], true, null, show_colors)
        );
    });

    console.log(
        color('[Output]', 'blue'),
        nutil.inspect(out.config, true, null, show_colors)
    );
} else if(argv.j) {
    console.log(JSON.stringify(out.config));
} else {
    console.log(nutil.inspect(out.config, true, null, show_colors));
}