require './setup'

Model = null
instance = null
api = null
next = process.nextTick

describe 'persistence', ->
  beforeEach ->
    api = {}
    Model = ento()
      .api(api)
      .use(ento.persistence)
    instance = new Model

  describe 'no sync', ->
    it 'throws an error', ->
      expect(->
        instance.fetch()
      ).throw /no api.sync/

  describe 'fetch success', ->
    beforeEach ->
      api.sync = (method, self, fn) ->
        next -> fn(null, title: 'x')

    describe 'events', ->
      it 'fetching', ->
        instance.on 'fetching', (fetching = sinon.spy())
        instance.fetch()
        expect(fetching).calledOnce

    it 'fetching + load', ->
      instance.on 'fetching', (fetching = sinon.spy())
      instance.on 'load', (load = sinon.spy())
      instance.fetch ->
        expect(fetching).calledOnce
        expect(load).calledOnce
        expect(load).calledAfter fetching

    it 'set state before', (done) ->
      instance.fetch (err, res) -> done()
      expect(instance.is.fetching).be.truthy

    it 'set state after', (done) ->
      instance.fetch (err, res) ->
        expect(instance.is.fetching).be.falsy
        expect(instance.is.loaded).be.truthy
        done()

    it 'no errors', (done) ->
      instance.fetch (err, res) ->
        expect(err).be.falsy
        done()

    it 'update title', (done) ->
      instance.fetch (err, res) ->
        expect(res.title).eq 'x'
        expect(instance.title).eq 'x'
        done()

  describe 'fetch fail', ->
    beforeEach ->
      api.sync = (method, self, fn) ->
          next -> fn(message: 'oops')

    describe 'events', ->
      it 'fetching', ->
        instance.on 'fetching', (fetching = sinon.spy())
        instance.fetch()
        expect(fetching).calledOnce

    it 'fetching + error', ->
      instance.on 'fetching', (fetching = sinon.spy())
      instance.on 'load', (load = sinon.spy())
      instance.on 'error', (error = sinon.spy())
      instance.fetch ->
        expect(fetching).calledOnce
        expect(load).not.called
        expect(error).calledOnce
        expect(error).calledAfter fetching

    it 'set state before', (done) ->
      instance.fetch (err, res) -> done()
      expect(instance.is.fetching).be.truthy
      expect(instance.is.loaded).be.falsy

    it 'set state after', (done) ->
      instance.fetch (err, res) ->
        expect(instance.is.fetching).be.falsy
        expect(instance.is.error).be.truthy
        expect(instance.is.error.message).eql 'oops'
        done()

    it 'err should be passed', (done) ->
      instance.fetch (err, res) ->
        expect(err).be.truthy
        expect(err.message).eq 'oops'
        expect(res).be.falsy
        done()

