module.exports = ->
  before ->
    global.expect = require('chai').expect

  before ->
    global.Rsrc = require('../index')
