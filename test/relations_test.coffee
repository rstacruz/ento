require './setup'

Author = null
Book = null
book = null

describe 'relations', ->
  describe 'hasOne', ->
    beforeEach ->
      Author = Ento()
        .attr('name')
        .attr('fullname', -> "Ms. #{@name}")

      Book = Ento()
        .use(Ento.relations)
        .hasOne('author', Author)

      book = new Book
        author: { name: 'Rowling', id: 1 }

    it 'correct type', ->
      expect(book.author).be.instanceOf Author

    it 'has properties', ->
      expect(book.author.fullname).eql "Ms. Rowling"

    it 'attrs', ->
      expect(book.author.name).eql 'Rowling'
      expect(book.author.id).eql 1


