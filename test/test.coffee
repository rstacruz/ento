Book = null
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
    
  describe 'attributes', ->
    beforeEach ->
      Book = ostruct()
        .attr('title')
      item = new Book()

    it 'has raw', ->
      expect(item.raw).be.a 'object'

    it 'attributes work', ->
      item.title = 'hi'
      expect(item.title).eq 'hi'

    it 'sets raw', ->
      item.title = 'hi'
      expect(item.raw.title).eq 'hi'

