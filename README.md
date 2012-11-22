# Figs—config management! [![Build Status](https://secure.travis-ci.org/Submersible/node-figs.png?branch=master)](http://travis-ci.org/Submersible/node-figs)

## What is it?

Provides config inheritance & overriding in a plethora of ways!

## What ways are those?

First of all, I want to say overriding will MERGE objects, not clobber the old
one with the new one.  Also, the following are listed from lowest precedence to
highest.

### Parent directory overriding

Well, first we start at your main module's directory, and begin looking for a
`config.js` and `config.json`.  The parent will OVERRIDE child configs (relative
to the folder structure).

This is useful if you want to share an overriding config between multiple
properties, because hey—sometimes a piece of functionality spans a few projects.

**For example:**

**/home/subc/ringer.io/frontend/config.json**
```json
{"hello": "world", "foo": "bar"}
```

**/home/subc/ringer.io/config.json**
```json
{"foo": "OVERRIDE"}
```

**Result:**
```json
{"hello": "world", "foo": "OVERRIDE"}
```

----------

### Local config overriding

We'll next load any `config.local.js` and `config.local.json` configs!

This is useful if you want to override things in your repo without committing
them to git.

**/home/subc/ringer.io/frontend/config.json**
```json
{"hello": "world", "foo": "bar"}
```
**/home/subc/ringer.io/frontend/config.local.json**
```json
{"foo": "LOAD ME"}
```

**/home/subc/ringer.io/config.json**
```json
{"foo": "OVERRIDE"}
```

**Result:**
```json
{"hello": "world", "foo": "LOAD ME"}
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

## Command Line Inspector Tool

To use the tool, install this library globally with NPM:

```
$ npm install -g figs
```

### Usage

```
Figs configuration inspector

Options:
  --help, -h   this message
  --stack, -s  print all configs in the inheritance chain
  --full, -f   full stack trace of all the configs
  --dir, -d    inspect from the specified directory
```

## License

(The MIT License)

Copyright (c) 2012 Ryan Munro &lt;ryan@ringer.io&gt;

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
