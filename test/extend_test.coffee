require './setup'

spy = null

describe 'extend', ->
  beforeEach ->
    spy = sinon.spy()

  it 'with constructor', ->
    Model = ento().extend(constructor: spy)
    new Model()
    expect(spy).calledOnce
