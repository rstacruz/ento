Resource = null
global.expect = require('chai').expect

before ->
  Resource = require('../index')

it 'ok', ->

it 'has events', ->
  expect(Resource.events).be.a 'object'

