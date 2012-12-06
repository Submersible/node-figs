/*jslint node: true, nomen: true, regexp: true, vars: true */

'use strict';

var test = require('tap').test,
    request = require('request'),
    connect = require('connect'),
    browserify = require('browserify'),
    util = require('./util');

var FAKE_ENV = {
    SHELL: '/bin/zsh',
    DISPLAY: ':0',
    PWD: '/home/ryan/projects/node-figs',
    HOME: '/home/ryan',
    USER: 'ryan',
    CONFIG_hello__world: 'FOOBAR',
    CONFIG_hello__rwar: 'YEP',
    CONFIG_blahhh: 'true',
    _: '/home/ryan/.nvm/v0.8.14/bin/node'
};

test('whitelist', function (t) {
    t.deepEqual(
        util.whitelist({hello: 'meow', zz: 'nope'}, {hello: {world: true}}),
        {hello: {world: undefined}}
    );
    t.deepEqual(
        util.whitelist({hello: {world: 'meow', foo: 'bar'}, zz: 'nope'}, {hello: {world: true}}),
        {hello: {world: 'meow'}}
    );
    t.deepEqual(
        util.whitelist({hello: {world: 'meow', foo: 'bar'}, zz: 'nope'}, {}),
        {}
    );
    t.end();
});

test('browserify', function (t) {
    var MATCH_CONFIG = /\/node_modules\/config\.js(.*)/,
        DATA = {hello: 'world'},
        app = connect();

    t.plan(1);

    app.use(browserify({
        mount: '/figs.js'
    }).use(util.browserify('/node_modules/config.js', DATA)));

    var server = app.listen(8213, '127.0.0.1', function (err) {
        if (err) {
            throw err;
        }

        request({uri: 'http://localhost:8213/figs.js'}, function (err, res, body) {
            var data = JSON.stringify(DATA) + ';',
                match = MATCH_CONFIG.exec(body)[0];
            t.equal(match.substr(-data.length), data);

            server.close();
        });
    }).on('close', function () {
        t.end();
    });
});

test('test config magic', function (t) {
    /* @TODO We need to mock the `fs` module to test this! */
    t.end();
});

test('possible configs', function (t) {
    t.deepEqual(util.possibleFiles(
        '/home/subc/ringer.io/front-end',
        ['config.js', 'config.json']
    ), [
        '/home/subc/ringer.io/front-end/config.json',
        '/home/subc/ringer.io/front-end/config.js',
        '/home/subc/ringer.io/config.json',
        '/home/subc/ringer.io/config.js',
        '/home/subc/config.json',
        '/home/subc/config.js',
        '/home/config.json',
        '/home/config.js',
        '/config.json',
        '/config.js'
    ]);
    t.end();
});

test('env to object', function (t) {
    t.deepEqual(
        util.envToObject('CONFIG_hello__world', 'foobar'),
        {hello: {world: 'foobar'}}
    );
    t.deepEqual(
        util.envToObject('CONFIG_hello__foo', 'true'),
        {hello: {foo: true}}
    );
    t.deepEqual(
        util.envToObject('CONFIG_top_dog', 'false'),
        {top_dog: false}
    );
    t.end();
});

test('filter env', function (t) {
    t.deepEqual(util.envFilter(FAKE_ENV), [
        ['CONFIG_hello__world', 'FOOBAR'],
        ['CONFIG_hello__rwar', 'YEP'],
        ['CONFIG_blahhh', 'true']
    ]);
    t.end();
});

test('build env', function (t) {
    t.deepEqual(util.envObject(FAKE_ENV), {
        hello: {
            world: 'FOOBAR',
            rwar: 'YEP'
        },
        blahhh: true
    });
    t.end();
});