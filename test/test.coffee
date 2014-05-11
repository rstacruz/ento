require './setup'

Book = null
item = null

describe 'Tests', ->
  it 'has events', ->
    expect(ento.events).be.a 'object'

  describe 'basic use case', ->
    it 'with api', ->
      @api = { sync: -> }
      Book = ento()
      item = new Book(@api, title: "Hello")
      expect(item.api).eq @api
      expect(item.title).eq "Hello"

    it 'without api', ->
      Book = ento()
      item = new Book(title: "Hello")
      expect(item.title).eq "Hello"

  describe 'instanceof', ->
    it 'true for the given class', ->
      Book = ento()
      item = new Book()
      expect(item instanceof Book).be.true

    it 'true for a subclass', ->
      Book = ento()
      Novel = Book.extend()
      item = new Novel()
      expect(item instanceof Novel).be.true

  describe 'set', ->
    it 'mass set', ->
      Book = ento()
      item = new Book()
      item.set(title: "X", author: "Y")
      expect(item.title).eq "X"
      expect(item.author).eq "Y"

    it 'single set', ->
      Book = ento()
      item = new Book()
      item.set 'title', 'X'
      expect(item.title).eq "X"

  describe 'attributes', ->
    beforeEach ->
      Book = ento()
        .attr('title')
        .attr('in_stock')
      item = new Book()

    it 'has raw', ->
      expect(item.raw).be.a 'object'

    it 'attributes work', ->
      item.title = 'hi'
      expect(item.title).eq 'hi'

    it "doesn't propagate to global", ->
      expect(ento.object.attributes).be.like {}

    it 'sets raw', ->
      item.title = 'hi'
      expect(item.raw.title).eq 'hi'

    it 'sets raw via set(str)', ->
      item.set('title', 'hi')
      expect(item.raw.title).eq 'hi'

    it 'sets raw via set(object)', ->
      item.set(title: 'hi')
      expect(item.raw.title).eq 'hi'

    it 'adds to attributes', ->
      expect(Object.keys(item.constructor.attributes)).be.like ['title', 'inStock']

    it 'adds to attributes, 2', ->
      expect(Object.keys(Book.attributes)).be.like ['title', 'inStock']

    it 'property definition', ->
      expect(Book.attributes.title).be.a 'object'
      expect(Book.attributes.inStock).be.a 'object'

    it 'attributeNames', ->
      expect(Book.attributeNames()).be.like ['title', 'inStock']

    it 'triggers a change:title event', (done) ->
      item.on 'change:title', (key) ->
        expect(key).eq 'title'
        done()

      item.title = 'hi'

    it 'camelcase setter', ->
      item.inStock = true
      expect(item.in_stock).eq true

    it 'underscored setter', ->
      item.in_stock = true
      expect(item.inStock).eq true

    it 'camelcase .set()', ->
      item.set inStock: true
      expect(item.in_stock).eq true

    it 'underscored .set()', ->
      item.set in_stock: true
      expect(item.inStock).eq true
