require './setup'

Author = null
Book = null
book = null

describe 'hasOne', ->
  beforeEach ->
    Author = Ento()
      .use(Ento.relations)
      .attr('id')
      .attr('name')
      .attr('fullname', -> "Ms. #{@name}")

    Book = Ento()
      .use(Ento.relations)
      .attr('id')
      .hasOne('author', inverse: 'book', -> Author)

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

    it 'when changing', ->
      previous = book.author
      book.author = new Author(id: 10)
      expect(book.authorId).eql 10
      previous.id = 2
      expect(book.authorId).eql 10

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
