'use strict'

module.exports = function rescue (callback) {
  return async (...args) => {
    const next = args.slice(-1).pop()
    try { await callback(...args) } catch (err) { next(err) }
  }
}
