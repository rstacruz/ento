require './setup'

Model = null
instance = null
other = null
spy = null
spy2 = null

describe 'events', ->
  beforeEach ->
    Model = ento()
    instance = new Model
    other = new Model
    spy = sinon.spy()
    spy2 = sinon.spy()

  describe 'on', ->
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

    it 'on(object)', ->
      instance.on aoeu: spy
      instance.trigger 'aoeu'
      expect(spy).calledOnce

    it 'on() with spaces', ->
      instance.on 'aoeu htns', spy
      instance.trigger 'aoeu'
      expect(spy).calledOnce

  it 'once', ->
    instance.once 'aoeu', spy
    instance.trigger 'aoeu'
    instance.trigger 'aoeu'
    instance.trigger 'aoeu'
    expect(spy).calledOnce

  it 'off() all', ->
    instance.on 'aoeu', spy
    instance.off()
    instance.trigger 'aoeu'
    expect(spy).not.called

  describe 'off', ->
    it 'off(fn)', ->
      instance.on 'aoeu', spy
      instance.off 'aoeu', spy
      instance.trigger 'aoeu'
      expect(spy).not.called

    it 'off(fn) with retaining', ->
      instance.on 'aoeu', spy
      instance.on 'aoeu', spy2
      instance.off 'aoeu', spy
      instance.trigger 'aoeu'
      expect(spy).not.called

    it 'off(fn, context)', ->
      context = {}
      instance.on 'aoeu', spy, context
      instance.off 'aoeu', null, context
      instance.trigger 'aoeu'
      expect(spy).not.called

  describe 'trigger', ->
    it 'one arg', ->
      instance.on 'aoeu', spy
      instance.trigger 'aoeu', 100
      expect(spy).calledWith 100

    it 'two args', ->
      instance.on 'aoeu', spy
      instance.trigger 'aoeu', 100, 200
      expect(spy).calledWith 100, 200

    it 'three args', ->
      instance.on 'aoeu', spy
      instance.trigger 'aoeu', 100, 200, 300
      expect(spy).calledWith 100, 200, 300

    it 'four+ args', ->
      instance.on 'aoeu', spy
      instance.trigger 'aoeu', 100, 200, 300, 400
      expect(spy).calledWith 100, 200, 300, 400

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

  describe 'model propagation', ->
    it 'ok', ->
      Model.on 'aoeu', spy
      instance = new Model
      instance.trigger('aoeu', 200)
      expect(spy).called
