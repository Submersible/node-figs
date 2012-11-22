#!/usr/bin/env node
/*jslint node: true, nomen: true */

'use strict';

var path = require('path'),
    nutil = require('util'),
    colors = require('colors'),
    optimist = require('optimist'),
    util = require('./util');

var argv = optimist
    .usage('Figs configuration inspector')
    .alias('h', 'help')
    .alias('s', 'stack')
    .alias('f', 'full')
    .alias('d', 'dir')
    .describe('help', 'this message')
    .describe('stack', 'print all configs in the inheritance chain')
    .describe('full', 'full stack trace of all the configs')
    .describe('dir', 'inspect from the specified directory')
    .argv;

var root = process.cwd(),
    show_colors = true;

function color(str, c) {
    if (show_colors) {
        return str[c];
    }
    return str;
}

if (argv.d) {
    root = path.resolve(root, argv.d);
}

var out = util.whereTheMagicHappens(root, process.env);

if (argv.h) {
    optimist.showHelp();
} else if (argv.s) {
    console.log(color('[Root]  ', 'magenta'));

    out.files.forEach(function (file) {
        console.log(color('[Loaded]', 'green'), file[0]);
    });

    out.envs.forEach(function (env) {
        console.log(color('[Env]   ', 'blue'), env[0]);
    });
} else if (argv.f) {
    console.log(color('[Root]  ', 'magenta'));

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
} else {
    console.log(nutil.inspect(out.config, true, null, show_colors));
}
