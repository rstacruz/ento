require './setup'

spy = null

describe 'init', ->
  beforeEach ->
    spy =
      init: sinon.spy()

  it 'fires event', ->
    Model = ento()
      .on('init', spy.init)

    new Model()
    expect(spy.init).calledOnce
