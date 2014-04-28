require './setup'

Book = null
item = null

describe 'attribute coercion', ->
  it 'string', ->
    Book = ento()
      .attr('title', String)

    item = new Book(title: 300)
    expect(item.title).be.eql "300"

  it 'undefined', ->
    Book = ento()
      .attr('title', String)

    item = new Book()
    expect(item.title).be.undefined

  it 'undefined', ->
    Book = ento()
      .attr('title', String)

    item = new Book(title: null)
    expect(item.title).be.null

  it 'number', ->
    Book = ento()
      .attr('pages', Number)

    item = new Book(pages: "390")
    expect(item.pages).be.eql 390

  it 'boolean, true', ->
    Book = ento()
      .attr('available', Boolean)

    item = new Book(available: 'yes')
    expect(item.available).be.eql true

  it 'boolean, false', ->
    Book = ento()
      .attr('available', Boolean)

    item = new Book(available: '')
    expect(item.available).be.eql false

  it 'boolean, undefined', ->
    Book = ento()
      .attr('available', Boolean)

    item = new Book(available: 'wtf')
    expect(item.available).be.eql undefined

  it 'date', ->
    Book = ento()
      .attr('publishedAt', Date)

    item = new Book(publishedAt: '2014/01/01')
    expect(+item.publishedAt).to.eql 1388505600000
