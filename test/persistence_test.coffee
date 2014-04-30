require './setup'

Model = null
instance = null

describe 'persistence', ->
  beforeEach ->
    Model = ento()
      .use(ento.persistence)
    instance = new Model

  it 'has fetch', ->
    expect(instance.fetch).be.a 'function'
