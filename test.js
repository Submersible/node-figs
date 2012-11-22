/*jslint node: true, nomen: true */

'use strict';

var test = require('tap').test,
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

test('test config magic', function (t) {
    /* @TODO We need to mock the `fs` module to test this! */
    t.end();
});

test('possible configs', function (t) {
    t.deepEqual(util.possibleFiles(
        '/home/subc/ringer.io/front-end',
        ['config.js', 'config.json']
    ), [
        '/home/subc/ringer.io/front-end/config.js',
        '/home/subc/ringer.io/front-end/config.json',
        '/home/subc/ringer.io/config.js',
        '/home/subc/ringer.io/config.json',
        '/home/subc/config.js',
        '/home/subc/config.json',
        '/home/config.js',
        '/home/config.json',
        '/config.js',
        '/config.json',
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
