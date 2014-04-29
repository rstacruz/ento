before ->
  global.chai = require('chai')
  chai.use require('chai-fuzzy')

before ->
  global.expect = chai.expect

beforeEach -> global.sinon = require('sinon').sandbox.create()
afterEach  -> global.sinon.restore()

before ->
  if process.env.distfile?
    global.ento = require('../' + process.env.distfile)
  else
    global.ento = require('../index.js')
