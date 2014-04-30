require './setup'

Model = null
instance = null
spy = null
build = null
init = null
staticSpy = null

describe 'constructors', ->
  beforeEach ->
    spy = sinon.spy()
    staticSpy = sinon.spy()

  describe 'init method', ->
    beforeEach ->
      Model = ento()
        .use(init: spy)
      instance = new Model()

    it 'called', ->
      expect(spy).called

    it 'called with init', ->
      expect(spy.firstCall.thisValue).eql instance

  describe 'build/init', ->
    beforeEach ->
      build = sinon.spy()
      init = sinon.spy()

    beforeEach ->
      Model = ento()
        .on('build', build)
        .on('init', init)
      instance = new Model()

    it 'build called', ->
      expect(build).called

    it 'init called', ->
      expect(init).called

    it 'call order', ->
      expect(init).calledAfter build

    it 'called with init as "this"', ->
      expect(build.firstCall.thisValue).eql instance
