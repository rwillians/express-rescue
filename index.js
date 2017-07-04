'use strict'

module.exports = function rescue (callback) {
  return async (...args) => {
    const handler = args.slice(-1).pop()

    try {
      return await callback(...args) // eslint-disable-line
    } catch (err) {
      return handler(err)
    }
  }
}
