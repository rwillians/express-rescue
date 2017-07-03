'use strict'

const chai = require('chai')
const chaiAsPromise = require('chai-as-promised')

global.expect = chai.use(chaiAsPromise).expect
