require './setup'

Book = null
item = null

describe 'attribute coercion', ->
  it 'string', ->
    Book = ostruct()
      .attr('title', String)

    item = new Book(title: 300)
    expect(item.title).be.eql "300"

  it 'number', ->
    Book = ostruct()
      .attr('pages', Number)

    item = new Book(pages: "390")
    expect(item.pages).be.eql 390

  it 'boolean, true', ->
    Book = ostruct()
      .attr('available', Boolean)

    item = new Book(available: 'yeah')
    expect(item.available).be.eql true

  it 'boolean, false', ->
    Book = ostruct()
      .attr('available', Boolean)

    item = new Book(available: '')
    expect(item.available).be.eql false

  it 'date', ->
    Book = ostruct()
      .attr('publishedAt', Date)

    item = new Book(publishedAt: '2014/01/01')
    expect(+item.publishedAt).to.eql 1388505600000
