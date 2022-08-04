'use strict'

const { expect } = require('chai').use(require('chai-as-promised'))
const rescue = require('../dist/index')
const sinon = require('sinon')

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
        .to.eventually.be.rejectedWith(TypeError, 'The last parameter received by express-rescue is not a function')
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

describe('rescue.from(MyError, (err) => { })', () => {
  class MyError extends Error {}
  class SomethingElse {}

  const req = {}
  const res = {}

  it('handles the error when error is instance of given constructor', () => {
    const matchedHandler = (err) => {
      expect(err).to.be.instanceOf(MyError)
    }

    const next = (_err) => {
      throw new Error('Not supposed to call this function .-.')
    }

    rescue.from(MyError, matchedHandler)(new MyError(), req, res, next)
    rescue.from(Error, matchedHandler)(new MyError(), req, res, next)
  })

  it('it call `next` function if error is not an instance of given constructor', () => {
    const matchedHandler = (_err) => {
      throw new Error('Not supposed to call this function .-.')
    }

    const next = (err) => {
      expect(err).to.be.instanceOf(SomethingElse)
    }

    rescue.from(MyError, matchedHandler)(new SomethingElse(), req, res, next)
  })
})
