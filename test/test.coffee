Book = null
Name = null
item = null

describe 'Tests', ->
  require('./setup')()

  it 'has events', ->
    expect(ostruct.events).be.a 'object'

  describe 'basic use case', ->
    it 'with api', ->
      @api = { sync: -> }
      Book = ostruct()
      item = new Book(@api, title: "Hello")
      expect(item.title).eq "Hello"

    it 'without api', ->
      Book = ostruct()
      item = new Book(title: "Hello")
      expect(item.title).eq "Hello"
    
  describe 'set', ->
    it 'mass set', ->
      Book = ostruct()
      item = new Book()
      item.set(title: "X", author: "Y")
      expect(item.title).eq "X"
      expect(item.author).eq "Y"

    it 'single set', ->
      Book = ostruct()
      item = new Book()
      item.set 'title', 'X'
      expect(item.title).eq "X"

  describe 'attributes', ->
    beforeEach ->
      Book = ostruct()
        .attr('title')
        .attr('in_stock')
      item = new Book()

    it 'has raw', ->
      expect(item.raw).be.a 'object'

    it 'attributes work', ->
      item.title = 'hi'
      expect(item.title).eq 'hi'

    it "doesn't propagate to global", ->
      expect(ostruct.object.properties).be.like []

    it 'sets raw', ->
      item.title = 'hi'
      expect(item.raw.title).eq 'hi'

    it 'sets raw via set(str)', ->
      item.set('title', 'hi')
      expect(item.raw.title).eq 'hi'

    it 'sets raw via set(object)', ->
      item.set(title: 'hi')
      expect(item.raw.title).eq 'hi'

    it 'adds to properties', ->
      expect(item.constructor.properties).be.like ['title', 'in_stock']

    it 'adds to properties, 2', ->
      expect(Book.properties).be.like ['title', 'in_stock']

    it 'triggers a change:title event', (done) ->
      item.on 'change:title', (val) ->
        expect(val).eq 'hi'
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

  describe 'getter', ->
    beforeEach ->
      Name = ostruct()
        .attr('first')
        .attr('last')
        .attr('full', -> "#{@first} #{@last}")

    it 'works', ->
      dude = new Name(first: 'Miles', last: 'Davis')
      expect(dude.full).eq 'Miles Davis'
