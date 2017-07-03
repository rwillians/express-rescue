[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/rwillians/express-rescue/badge.svg?branch=master)](https://coveralls.io/github/rwillians/express-rescue?branch=master)
[![Build Status](https://travis-ci.org/rwillians/express-rescue.svg?branch=master)](https://travis-ci.org/rwillians/express-rescue)

[![NPM](https://nodei.co/npm/express-rescue.png)](https://npmjs.org/package/express-rescue)

# Express Rescue

It's a wrapper for async functions which makes sure all async errors are passed to your error handler preventing those anoing `UnhandledPromiseRejectionWarning` when using async/await, especially with expressjs routes/middlewares. And nope, this is not an anti-pattern.


## Usin with expressjs

It's so simple... how about I just show you how it's done?

```js
const rescue = require('express-rescue')

// ...

app.get('/:id', rescue(async (req, res, next) => {
    const user = await repository.getById(req.params.id)

    if (!user) {
      throw new UserNotFoundError
    }

    res.status(200)
       .json(user)
}))

app.use((err, req, res, next) => {
  if (err instanceof UserNotFoundError) {
    return res.status(404)
              .json({ error: 'these are not the droids you\'re looking for'})
  }

  res.status(500)
     .json({ error: 'i have a bad feeling about this'})
})

```


That's all. Told you it was simple, right?


## Using anywhere else

It was intended to be use with [expressjs](http://expressjs.com/) but I'm pretty sure you could use it anywhere you want since you pass your error handler as the last argument.

Let's try it out:

```js
const rescue = require('express-rescue')

const somethingWrong = rescue(function (arg1, arg2, arg3, arg4, errorHandler) {
  throw new Error('Houston, we have a problem!')
})

const arg1 = null
const arg2 = null
const arg3 = null
const arg4 = null

const errorHandler = function (err) {
  console.log(err.message)
  process.exit(1)
}

somethingWrong(arg1, arg2, arg3, arg4, errorHandler) // Houston, we have a problem!
```

Oh in case you didn't notice: yes, you're not limited to use only async functions. `somethingWrong` is a regular (sync) function.


**Hope you enjoy the async/await heaven!**

Chears!


## Tests

```txt
yarn test v0.27.5
$ mocha specs --require ./specs/spec-helper.js


  const callable = rescue(async ([err,] req, res, next) => { })
    calls the last argument (next) with the thrown error
      ✓ Raises a TypeError if last argument is not a function
      ✓ callable(req, res, next) - works for routes and middlewares
      ✓ callable(err, req, res, next) - works for error handler middlewares
      ✓ callable(foo, bar, baz, foobar, foobaz, errorHandler) - should work for basically anything, since you place an error handler as the last argument


  4 passing (17ms)

Done in 0.48s.
```
