# Figs—config management! [![Build Status](https://secure.travis-ci.org/Submersible/node-figs.png?branch=master)](http://travis-ci.org/Submersible/node-figs)

## What is it?

Provides config inheritences & overriding in a plethora of ways!

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

### Passed overriding config

You can also load a config by setting CONFIG="/home/subc/ringer.io-override.js" in
your environment before starting the Node.js process.

This is useful for production, so we can specify production configurations.

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
