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

  describe 'reserved keyword (set)', ->
    beforeEach ->
      Model = ento().attr('set')
      instance = new Model(set: 'x')

    it '.get(str)', ->
      expect(instance.get('set')).eq 'x'

  describe 'reserved keyword (get)', ->
    beforeEach ->
      Model = ento().attr('get')
      instance = new Model(get: 'x')

    it '.get(str)', ->
      expect(instance.get('get')).eq 'x'
