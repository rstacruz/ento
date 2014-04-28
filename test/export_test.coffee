require './setup'

describe 'export', ->
  it 'ok', ->
    Book = ento()
      .attr('title')
      .attr('author')
      .use(ento.exportable)

    data = new Book(title: 'T', author: 'A').export()

    expect(data).be.like { title: 'T', author: 'A' }

  it 'hide non-enumerables', ->
    Book = ento()
      .attr('title')
      .attr('author', enumerable: false)
      .use(ento.exportable)

    data = new Book(title: 'T', author: 'A').export()

    expect(data).be.like { title: 'T' }

  it 'hide non-exportables', ->
    Book = ento()
      .attr('title')
      .attr('author', exportable: false)
      .use(ento.exportable)

    data = new Book(title: 'T', author: 'A').export()

    expect(data).be.like { title: 'T' }

