describe 'Tests', ->
  require('./setup')()

  it 'has events', ->
    expect(ostruct.events).be.a 'object'

  it 'basic use case with api', ->
    @api = { sync: -> }
    Book = ostruct()
    item = new Book(@api, title: "Hello")
    expect(item.title).eq "Hello"

  it 'basic use case without api', ->
    Book = ostruct()
    item = new Book(title: "Hello")
    expect(item.title).eq "Hello"
  
  it 'attributes', ->
    Book = ostruct()
      .attr('title')
    item = new Book()

    item.title = 'hi'
    expect(item.title).eq 'hi'


