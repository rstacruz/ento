require './setup'

Model = null
instance = null
api = null
spy = null
next = process.nextTick

describe 'persistence', ->
  beforeEach ->
    api = {}
    Model = ento()
      .api(api)
      .use(ento.persistence)
    instance = new Model

  describe 'fetch success', ->
    beforeEach ->
      api.sync = (method, self, fn) ->
        next -> fn(null, title: 'x')

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

