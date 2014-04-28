module.exports = ->
  before ->
    global.expect = require('chai').expect

  before ->
    global.Struct = require('../index')
