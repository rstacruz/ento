module.exports = ->
  before ->
    global.chai = require('chai')
    chai.use require('chai-fuzzy')

  before ->
    global.expect = chai.expect

  before ->
    global.ostruct = require('../index')
