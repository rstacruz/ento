require './setup'

spy = null

describe 'init', ->
  beforeEach ->
    spy = sinon.spy()

  it 'fires event', ->
    Model = ento()
      .on('init', spy)

    new Model()
    expect(spy).calledOnce

  it 'runs .init', ->
    Model = ento()
      .use(init: spy)

    new Model()
    expect(spy).calledOnce
    expect(spy.firstCall.thisValue.constructor).eql Model

  it '.build', ->
    Model = ento()
    instance = Model.build(title: 'x')

    expect(instance.title).eq 'x'

