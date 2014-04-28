module.exports = ->
  before ->
    global.expect = require('chai').expect

  before ->
    global.ostruct = require('../index')
