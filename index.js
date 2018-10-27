'use strict'

const rescue = function rescue (callback) {
  return async function rescuehandler (...args) {
    const handler = args.slice(-1).pop()

    try {
      return await callback(...args) // eslint-disable-line
    } catch (err) {
      return handler(err)
    }
  }
}

rescue.from = function rescuefrom (constructor, fn) {
  return function errorhandler (err, req, res, next) {
    if (!(err instanceof constructor)) {
      return next(err)
    }

    fn(err, req, res, next)
  }
}

module.exports = rescue
