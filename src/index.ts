import { Request, Response, NextFunction } from 'express'

module.exports = function rescue (callback: Function) {
  return async function rescuehandler (...args: unknown[]) {
    const handler = args.slice(-1).pop() as Function
    try {
      return await callback(...args) // eslint-disable-line
    } catch (err) {
      return handler(err)
    }
  }
}

module.exports.from = function rescuefrom (constructor: { new(...args: any[]): Error }, fn: Function) {
  return function errorhandler (err: Error, req: Request, res: Response, next: NextFunction) {
    if (!(err instanceof constructor)) {
      return next(err)
    }

    fn(err, req, res, next)
  }
}
