require './setup'

Ractive = require('ractive')
Book = null
Author = null
book = null
view = null

describe 'Ractive: relations', ->
  before ->
    Ractive.adaptors.ento = Ento.ractiveAdaptor

  beforeEach 'build the class', ->
    Book = Ento()
    Author = Ento()

    Author
      .use(Ento.relations)
      .attr('first')
      .attr('last')
      .attr('full', ['first', 'last'], -> [@first, @last].join(' '))
      .belongsTo('book', Book)

    Book
      .use(Ento.relations)
      .attr('title')
      .hasOne('author', Author)

  beforeEach ->
    book = new Book
      title: "Pelican Brief"
      author: { first: "John", last: "Grisham" }

  it 'should work', ->
    expect(book.author.full).eql "John Grisham"

  it '.get() should return author instance', ->
    data = book.get()
    expect(data.author).instanceOf Author

  it 'yeah', ->
    view = new Ractive
      data: { book: book }
      adapt: 'ento'
      template: "<div>{{ book.title }} by {{ book.author.full }}</div>"

    expect(view.toHTML()).include 'Pelican Brief by John Grisham'
