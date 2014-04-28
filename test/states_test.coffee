require './setup'
Book = null

describe 'states', ->
  beforeEach ->
    Book = ento()
      .attr('title')

  it 'fresh: true', ->
    item = new Book()
    expect(item.is.fresh).be.true

  it 'fresh: true with ctor options', ->
    item = new Book(title: "Darkly Dreaming")
    expect(item.is.fresh).be.true

  it 'fresh: true with ctor options of untracked attribude', ->
    item = new Book(author: "Lindsay")
    expect(item.is.fresh).be.true

  it 'fresh: false', ->
    item = new Book()
    item.title = "Darkly Dreaming"
    expect(item.is.fresh).be.false

  it 'fresh: true, untracked attribute', ->
    item = new Book()
    item.author = "Lindsay"
    expect(item.is.fresh).be.true
