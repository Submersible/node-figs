# Figs—config management! [![Build Status](https://secure.travis-ci.org/Submersible/node-figs.png?branch=master)](http://travis-ci.org/Submersible/node-figs)

## What is it?

Provides config inheritance & overriding in a plethora of ways!

## What ways are those?

First of all, I want to say overriding will MERGE objects, not clobber the old
one with the new one.  Also, the following are listed from lowest precedence to
highest.

### Config inheritance

This will allow you to inherit & override configs in parent directories.

This is useful if you want to share a config between multiple projects.

**For example:**

**/home/subc/ringer.io/config.json**
```json
{"foo": "base", "bar": "meow"}
```

**/home/subc/ringer.io/frontend/config.json**
```json
{"hello": "WORLD", "foo": "OVERRIDE"}
```

**Result:**
```json
{"hello": "WORLD", "foo": "OVERRIDE", "bar": "meow"}
```

----------

### Local config overriding

We'll next load any `config.local.js` and `config.local.json` configs!
Inheritance also works with these local configs too.

This is useful if you want to override things in your repo without committing
them.

**/home/subc/ringer.io/frontend/config.json**
```json
{"foo": "bar"}
```

**/home/subc/ringer.io/frontend/config.local.json**
```json
{"foo": "OVERRIDE"}
```

**Result:**
```json
{"foo": "OVERRIDE"}
```

----------

### Parent directory clobbering

Finally, you can club children by creating a `config.js` or `config.json` in
a parent directory.  This works in the exact opposite of the config inheritance,
think of it as seniority.

This is useful for when you're working on multiple projects, and you want to
clobber all those mofos at once, and you're too lazy to use an environment
variable.

**For example:**

**/home/subc/ringer.io/frontend/config.json**
```json
{"ringer_www_domain": "ringer.io"}
```

**/home/subc/clobber.json**
```json
{"ringer_www_domain": "localhost"}
```

**Result:**
```json
{"ringer_www_domain": "localhost"}
```

----------

### Passed overriding config

You can also load a config by setting `CONFIG="/home/subc/ringer.io-override.js"` in
your environment before starting the Node.js process.

This is useful for production, so we can specify production configurations.

----------

### Passed overriding ENVs

You can override any property with a string by passing in a ENV variable which
maps to a key in the object.

This is useful for production, if you're too lazy to add the override to a file.

To map a key to an ENV variable, replace `.` with `__`, and prepend it with
`CONFIG_`.

Passing `true`, `false` will set booleans!  Otherwise it will set the string you pass.

**For example:**

```
CONFIG_domain__ringer_www__host="dev.ringer.io.com"
CONFIG_debug="true"
```

**Result:**
```json
{"domain": {"ringer_www": {"host": "dev.ringer.io.com"}},
 "debug": true}
```

## Command line inspector tool

To use the tool, install this library globally with NPM:

```
$ npm install -g figs
```

### Usage

```
Use: figs [-opts] [directory]

Arguments:
  directory   inspect from the specified directory

Options:
  --help, -h  this message
  --list, -l  all configs in the inheritance chain
  --view, -v  full stack trace of all the configs & contents
  --json, -j  View the raw JSON
```

## Node.js Usage

Require figs directly into your config variable.

```javascript
// config.js
exports.debug = true;

// app.js
var config = require('figs');

console.log('Are we in debug mode?', config.debug);
```

## Front-end Usage

Simply pass the config object into browserify, and this will build the state of
your config into your browserify bundle at the time of compilation.

```javascript
// bundling
browserify.use(require('figs'));

// front-end
var config = require('figs');
```

You can also call `figs` with an object to return a Browserify plugin mounting
that as your config in the front end.  This will wash your configuration
to only include a subset of your configuration.  Because I'm sure you have
secret keys in your config.

```javascript
var config = require('figs');

var bundle = browserify({
    // ...
});

bundle.use(config({
    extra: 'config variables',
    domain: config.domain,
    fb: {
        app_id: config.fb.app_id,
        scope: config.fb.scope
        // We don't want our `fb.secret` in our front end!
    }
}));
```

You can also use it from the browserify tool.

```
$ browserify --plugin figs
```

## License

(The MIT License)

Copyright (c) 2012 Ryan Munro &lt;ryan@subc.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
