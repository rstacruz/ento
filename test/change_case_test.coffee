require './setup'

spy1 = null
spy2 = null
Person = null
me = null

describe 'change case', ->
  beforeEach ->
    spy1 = sinon.spy()
    spy2 = sinon.spy()

  beforeEach ->
    Person = ento()
      .on('change:firstName', spy1)
      .on('change:first_name', spy2)

  afterEach ->
    expect(spy1).calledOnce
    expect(spy2).calledOnce

  describe 'camelCase attr', ->
    beforeEach ->
      Person.attr('firstName')
      me = new Person()

    it 'camelCase set', ->
      me.firstName = 'hi'

    it 'undescore set', ->
      me.first_name = 'hi'

  describe 'underscore attr', ->
    beforeEach ->
      Person.attr('first_name')
      me = new Person()

    it 'camelCase set', ->
      me.firstName = 'hi'

    it 'undescore set', ->
      me.first_name = 'hi'

