require './setup'

Model = null
instance = null

describe 'get', ->
  describe 'simple case', ->
    beforeEach ->
      Model = ento().attr('title')
      instance = new Model(title: 'x')

    it 'getter', ->
      expect(instance.title).eq 'x'

    it '.get(str)', ->
      expect(instance.get('title')).eq 'x'

    it '.get(str) of non-attribute', ->
      instance.year = 2001
      expect(instance.get('year')).eq 2001

