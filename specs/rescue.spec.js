'use strict'

const sinon = require('sinon')
const rescue = require('../index')

describe('const callable = rescue(async ([err,] req, res, next) => { })', () => {
    describe('calls the last argument (next) with the thrown error', () => {
      const error = new Error
      const route = rescue(async (req, res, next) => { throw error })

      it('callable(req, res, next) - works for routes and middlewares', () => {
        const spy = sinon.spy()
        route({}, {}, spy).then(() => {
          expect(spy).to.be.calledOnce
        })
      })

      it('callable(err, req, res, next) - works for error handler middlewares', () => {
        const spy = sinon.spy()
        route({}, {}, {}, spy).then(() => {
          expect(spy).to.be.calledOnce
        })
      })

      it('callable(foo, bar, baz, foobar, foobaz, errorHandler) - should work for basically anything, since you place an error handler as the last argument', () => {
        const spy = sinon.spy()
        route({}, {}, {}, {}, {}, {}, {}, spy).then(() => {
          expect(spy).to.be.calledOnce
        })
      })
    })
})
