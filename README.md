[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/rwillians/express-rescue/badge.svg?branch=master)](https://coveralls.io/github/rwillians/express-rescue?branch=master)
[![Build Status](https://travis-ci.org/rwillians/express-rescue.svg?branch=master)](https://travis-ci.org/rwillians/express-rescue)
![node-current](https://img.shields.io/node/v/express-rescue)

[![NPM](https://nodei.co/npm/express-rescue.png)](https://npmjs.org/package/express-rescue)

# Express Rescue

This is a dependency-free wrapper (or sugar code layer if you will) for async middlewares which makes sure all async errors are passed to your stack of error handlers, allowing you to have a **cleaner and more readable code**.

> **Note**
> Even though this library is supposed to work on `node >= 7.6`, we are unable to test against node versions `7`, `8` and `9` because our tooling requires at least node version `10`. We'll keep the minimum requirement for this library at version `node >= 7.6` so that we allow old projects to keep getting updates, but be aware that we are unable to test againt the mentioned versions.


## How to use it

It's really simple:

```js
const rescue = require('express-rescue')

/**
 * `rescue` insures thrown errors are passed to `next` callback.
 */
app.get('/:id', rescue(async (req, res, next) => {
    const user = await repository.getById(req.params.id)

    if (!user) {
      throw new UserNotFoundError
    }

    res.status(200)
       .json(user)
}))

/**
 * `rescue.from` allows you to handle a specific error which is helpful for
 * handling domain errors.
 */
app.use(rescue.from(UserNotFoundError, (err, req, res, next) => {
    res.status(404)
       .json({ error: 'these are not the droids you\'re looking for'})
})

/**
 * Your error handlers still works as expected. If an error doesn't match your
 * `rescue.from` criteria, it will find its way to the next error handler.
 */
app.use((err, req, res, next) => {
    res.status(500)
       .json({ error: 'i have a bad feeling about this'})
})

```

That's all.


**Hope you enjoy the async/await heaven!**

Chears!


## Tests

```txt
> express-rescue@1.1.26 test /Users/rwillians/Projects/express-rescue
> mocha specs --require ./specs/spec-helper.js

  const callable = rescue(async ([err,] req, res, next) => { })
    calls the last argument (next) with the thrown error
      ✓ All arguments are been passed to the callback
      ✓ Raises a TypeError if last argument is not a function
      ✓ callable(req, res, next) - works for routes and middlewares
      ✓ callable(err, req, res, next) - works for error handler middlewares
      ✓ callable(foo, bar, baz, foobar, foobaz, errorHandler) - should work for basically anything, since you place an error handler as the last argument


  5 passing (7ms)
```
