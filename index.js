'use strict'

module.exports = function rescue (callback) {
  return async (...args) => {
    const handler = args.slice(-1).pop()

    try {
      return await callback.call(args)
    } catch (err) {
      return handler(err)
    }
  }
}
