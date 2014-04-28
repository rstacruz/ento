before ->
  global.chai = require('chai')
  chai.use require('chai-fuzzy')

before ->
  global.expect = chai.expect

before ->
  if process.env.distfile?
    global.ostruct = require('../' + process.env.distfile)
  else
    global.ostruct = require('../index.js')
