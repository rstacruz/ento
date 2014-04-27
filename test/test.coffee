describe 'Tests', ->
  require('./setup')()

  it 'has events', ->
    expect(Rsrc.events).be.a 'object'

  it 'basic use case with api', ->
    @Book = Rsrc()
    @api = { sync: -> }
    @book = new @Book(@api, title: "Hello")
    expect(@book.title).eq "Hello"

  it 'basic use case without api', ->
    @Book = Rsrc()
    @book = new @Book(title: "Hello")
    expect(@book.title).eq "Hello"


