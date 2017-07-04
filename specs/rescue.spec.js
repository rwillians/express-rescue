'use strict'

const sinon = require('sinon')
const rescue = require('../index')

describe('const callable = rescue(async ([err,] req, res, next) => { })', () => {
  describe('calls the last argument (next) with the thrown error', () => {
    const error = new Error()
    const route = rescue(async (req, res, next) => { throw error })

    it('All arguments are been passed to the callback', async () => {
      const spy1 = sinon.spy()
      const spy2 = sinon.spy()
      const spy3 = sinon.spy()
      const callable = rescue((arg1, arg2, arg3) => {
        [arg1, arg2, arg3].forEach(a => a())
      })

      await callable(spy1, spy2, spy3)

      expect(spy1.called).to.equals(true)
      expect(spy2.called).to.equals(true)
      expect(spy3.called).to.equals(true)
    })

    it('Raises a TypeError if last argument is not a function', () => {
      expect(route({}, {}, {}, {}, {}, {}))
        .to.eventually.be.rejectedWith(TypeError, 'handler is not a function')
    })

    it('callable(req, res, next) - works for routes and middlewares', () => {
      const spy = sinon.spy()
      route({}, {}, spy).then(() => {
        expect(spy.called).to.equals(true)
      })
    })

    it('callable(err, req, res, next) - works for error handler middlewares', () => {
      const spy = sinon.spy()
      route({}, {}, {}, spy).then(() => {
        expect(spy.called).to.equals(true)
      })
    })

    it('callable(foo, bar, baz, foobar, foobaz, errorHandler) - should work for basically anything, since you place an error handler as the last argument', () => {
      const spy = sinon.spy()
      route({}, {}, {}, {}, {}, {}, {}, spy).then(() => {
        expect(spy.called).to.equals(true)
      })
    })
  })
})
