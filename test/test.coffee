describe 'Tests', ->
  require('./setup')()

  it 'has events', ->
    expect(Rsrc.events).be.a 'object'

  it 'basic use case', ->
    @Book = Rsrc()
    @api = { sync: -> }
    @book = new @Book(@api, title: "Hello")
    expect(@book.title).eq "Hello"


