require './setup'

describe 'export', ->
  it 'ok', ->
    Book = ento()
      .attr('title')
      .attr('author')

    data = new Book(title: 'T', author: 'A').get()

    expect(data).be.like { title: 'T', author: 'A', is: { fresh: true } }

  it 'hide non-enumerables', ->
    Book = ento()
      .attr('title')
      .attr('author', enumerable: false)

    data = new Book(title: 'T', author: 'A').get()

    expect(data.title).eql 'T'
    expect(data.author).be.undefined

  it 'hide non-exportables', ->
    Book = ento()
      .attr('title')
      .attr('author', export: false)

    data = new Book(title: 'T', author: 'A').get()

    expect(data.title).eql 'T'
    expect(data.author).be.undefined
