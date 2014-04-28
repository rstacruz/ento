describe 'Tests', ->
  require('./setup')()

  it 'has events', ->
    expect(ostruct.events).be.a 'object'

  it 'basic use case with api', ->
    @Book = ostruct()
    @api = { sync: -> }
    @book = new @Book(@api, title: "Hello")
    expect(@book.title).eq "Hello"

  it 'basic use case without api', ->
    @Book = ostruct()
    @book = new @Book(title: "Hello")
    expect(@book.title).eq "Hello"


