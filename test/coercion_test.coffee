require './setup'

Book = null
item = null

describe 'attribute coercion', ->
  it 'string', ->
    Book = ostruct()
      .attr('title', String)

    item = new Book(title: 300)
    expect(item.title).be.eql "300"

  it 'undefined', ->
    Book = ostruct()
      .attr('title', String)

    item = new Book()
    expect(item.title).be.undefined

  it 'undefined', ->
    Book = ostruct()
      .attr('title', String)

    item = new Book(title: null)
    expect(item.title).be.null

  it 'number', ->
    Book = ostruct()
      .attr('pages', Number)

    item = new Book(pages: "390")
    expect(item.pages).be.eql 390

  it 'boolean, true', ->
    Book = ostruct()
      .attr('available', Boolean)

    item = new Book(available: 'yes')
    expect(item.available).be.eql true

  it 'boolean, false', ->
    Book = ostruct()
      .attr('available', Boolean)

    item = new Book(available: '')
    expect(item.available).be.eql false

  it 'boolean, undefined', ->
    Book = ostruct()
      .attr('available', Boolean)

    item = new Book(available: 'wtf')
    expect(item.available).be.eql undefined

  it 'date', ->
    Book = ostruct()
      .attr('publishedAt', Date)

    item = new Book(publishedAt: '2014/01/01')
    expect(+item.publishedAt).to.eql 1388505600000
