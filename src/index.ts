import { Request, Response, NextFunction } from 'express'
import NonFunctionNextError from './errors/NonFunctionNextError'

export { Request, Response, NextFunction }
export declare type Callback = (...args: any[]) => Promise<void> | void
export declare type ErrorConstructor = { new(...args: any[]): Error }
export declare interface Rescue {
  (callback: Callback): Callback
  from (constructor: ErrorConstructor, callback: Callback): Callback
}

const rescue: Rescue = function rescue (callback) {
  return async function rescuehandler (...args: any[]): Promise<void> {
    const next = args.slice(-1).pop() as NextFunction

    if (typeof next !== 'function') {
      throw new NonFunctionNextError()
    }

    try {
      await callback(...args) // eslint-disable-line
    } catch (err) {
      next(err)
    }
  }
}

rescue.from = function rescuefrom (constructor, callback) {
  return function errorhandler (err: Error, req: Request, res: Response, next: NextFunction) {
    if (!(err instanceof constructor)) {
      next(err)
    }

    callback(err, req, res, next)
  }
}

export default rescue
module.exports = rescue
