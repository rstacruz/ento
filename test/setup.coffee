before ->
  global.chai = require('chai')
  chai.use require('chai-fuzzy')
  chai.use require('sinon-chai')

before ->
  global.expect = chai.expect

beforeEach -> global.sinon = require('sinon').sandbox.create()
afterEach  -> global.sinon.restore()

before ->
  if process.env.distfile?
    global.ento = require('../' + process.env.distfile)
  else
    global.ento = require('../index.js')

  global.Ento = global.ento
