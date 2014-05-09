require './setup'

Items = null
list = null

describe 'collections', ->
  beforeEach 'create class', ->
    Items = Ento()
      .use(Ento.collection)

  describe 'empty list', ->
    beforeEach 'instanciate', ->
      list = new Items()

    it 'length', ->
      expect(list.length).eql 0

    it '.set', ->
      list.set [ {name: 'blue'}, {name: 'yellow'} ]
      expect(list.length).eql 2
      expect(list.get('length')).eql 2

    it '.set should trigger change in length', ->
      list.on 'change:length', spy('change:length')
      list.set [ {name: 'blue'}, {name: 'yellow'} ]
      expect(spy('change:length')).calledOnce

  describe 'full list', ->
    beforeEach 'instanciate', ->
      list = new Items()
      list.set [ {name: 'red'}, {name: 'green'} ]

    it 'forEach', ->
      names = []
      list.forEach (item) ->
        names.push(item.name)

      expect(names).like ['red', 'green']

    it 'length', ->
      expect(list.length).eql 2

    it 'at', ->
      expect(list.at(0).name).eql 'red'

  describe 'to do', ->
    it 'model coercion (!)', ->

    it 'push', ->
    it 'pop', ->
    it 'shift', ->
    it 'unshift', ->

    it 'sort and filter (!)', ->
