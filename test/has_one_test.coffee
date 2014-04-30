require './setup'

Author = null
Book = null
book = null
author = null

describe 'hasOne + belongsTo', ->
  beforeEach ->
    Author = Ento()
      .use(Ento.relations)
      .attr('id')
      .attr('name')
      .attr('fullname', json: false, -> "Ms. #{@name}")

    Book = Ento()
      .use(Ento.relations)
      .attr('id')
      .belongsTo('author', as: 'book', -> Author)

  # ----
  describe 'fresh', ->
    it 'default to nothing', ->
      book = new Book()
      expect(book.author).be.undefined

  # ----
  describe '.author = new Author', ->
    beforeEach ->
      book = new Book()
      book.author = new Author(name: 'JK', id: 2)

    it 'should work', ->
      expect(book.author).be.instanceOf Author

    it 'propagate to child', ->
      expect(book.author.book).eql book

    it 'propagate id', ->
      expect(book.authorId).eql 2

    it 'propagate id after changing', ->
      book.author.id = 3
      expect(book.authorId).eql 3

    it 'stop listening to old one', ->
      previous = book.author
      book.author = new Author(id: 10)
      expect(book.authorId).eql 10
      previous.id = 2
      expect(book.authorId).eql 10

    it 'parent.toJSON', ->
      expect(book.toJSON()).be.like { id: undefined, authorId: 2 }

  xdescribe 'todo', ->
    it 'propagate change event of children', ->
    it 'belongsTo', ->

  # ----
  describe 'change events', ->
    it 'change:attr_id', ->

  # ----
  describe 'new Book(author: {})', ->
    beforeEach ->
      book = new Book
        author: { name: 'Rowling', id: 1 }

    it 'correct type', ->
      expect(book.author).be.instanceOf Author

    it 'has properties', ->
      expect(book.author.fullname).eql "Ms. Rowling"

    it 'attrs', ->
      expect(book.author.name).eql 'Rowling'
      expect(book.author.id).eql 1

    it 'propagate parent', ->
      expect(book.author.book).eql book

    it 'clearing', ->
      book.author = undefined
      expect(book.author).be.undefined

    it 'propagate id', ->
      expect(book.authorId).eql 1

    it 'propagate id after changing', ->
      book.author.id = 3
      expect(book.authorId).eql 3

    it 'stop listening to old one', ->
      previous = book.author
      book.author = new Author(id: 10)
      expect(book.authorId).eql 10
      previous.id = 2
      expect(book.authorId).eql 10

  # ----
  describe 'set via .attr_id', ->
    it 'id, camelcase', ->
      book = new Book()
      book.authorId = 200
      expect(book.author).be.instanceOf Author
      expect(book.author.id).eql 200

    it 'id, underscore', ->
      book = new Book()
      book.author_id = 200
      expect(book.author).be.instanceOf Author
      expect(book.author.id).eql 200

    it 'stop listening to old one', ->
      previous = book.author
      book.author = new Author(id: 10)
      expect(book.authorId).eql 10
      previous.id = 2
      expect(book.authorId).eql 10

  # ---
  describe 'bidirectional', ->
    beforeEach ->
      Author.belongsTo('book', as: 'author', -> Book)
      book = new Book(id: 10, author: { name: 'JK', id: 3 })
      author = book.author

    it 'works both ways', ->
      expect(author.book).eql book
      expect(book.author).eql author

    it 'propagate id', ->
      author.id = 4
      expect(book.authorId).eql 4

    it 'propagate id the other way', ->
      book.id = 5
      expect(author.bookId).eql 5

    it 'child.toJSON', ->
      expect(JSON.stringify(author)).eql '{"id":3,"name":"JK","bookId":10}'

  describe 'hasOne', ->
    beforeEach ->
      Author.hasOne('book', as: 'author', -> Book)
      book = new Book(author: { name: 'JK', id: 3 })
      author = book.author

    it 'no id', ->
      expect(author.book_id).be.undefined
      expect(author.bookId).be.undefined

    it 'has model', ->
      expect(author.book).eql book
