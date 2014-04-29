require './setup'

Model = null
instance = null
other = null
spy = null

describe 'events', ->
  beforeEach ->
    Model = ento()
    instance = new Model
    other = new Model
    spy = sinon.spy()

  it 'on', ->
    instance.on 'aoeu', spy
    instance.trigger 'aoeu'
    expect(spy).calledOnce

  it 'on with context', ->
    context = {}
    instance.on 'aoeu', spy, context
    instance.trigger 'aoeu'
    expect(spy).calledOnce
    expect(spy.firstCall.thisValue).eql context

  it 'once', ->
    instance.once 'aoeu', spy
    instance.trigger 'aoeu'
    instance.trigger 'aoeu'
    instance.trigger 'aoeu'
    expect(spy).calledOnce

  it 'off(fn)', ->
    instance.on 'aoeu', spy
    instance.off 'aoeu', spy
    instance.trigger 'aoeu'
    expect(spy).not.called

  it 'off(fn, context)', ->
    context = {}
    instance.on 'aoeu', spy, context
    instance.off 'aoeu', null, context
    instance.trigger 'aoeu'
    expect(spy).not.called

  it 'listenTo', ->
    instance.listenTo other, 'aoeu', spy
    other.trigger 'aoeu'
    expect(spy).calledOnce

  it 'stopListening', ->
    instance.listenTo other, 'aoeu', spy
    instance.stopListening()
    other.trigger 'aoeu'
    expect(spy).not.called

  it 'stopListening(obj)', ->
    instance.listenTo other, 'aoeu', spy
    instance.stopListening(other)
    other.trigger 'aoeu'
    expect(spy).not.called

  describe 'inheritance', ->
    it 'simple', ->
      Model = ento().on('foo', spy)
      Supermodel = Model.extend()
      Supermodel.trigger 'foo'
      expect(spy).called

    it 'dont propagate upwards', ->
      Model = ento()
      Supermodel = Model.extend()
      Supermodel.on 'foo', spy
      Model.trigger 'foo'
      expect(spy).not.called

