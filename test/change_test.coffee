require './setup'

changeTitle = null
change = null
Book = null
book = null

describe 'change', ->

  beforeEach ->
    changeTitle = sinon.spy()
    change = sinon.spy()

  describe 'simple case', ->
    beforeEach ->
      Book = ento().attr('title')
      book = new Book()

    it 'local events', ->
      book.on 'change:title', changeTitle
      book.title = 'x'

      expect(changeTitle.calledOnce).true

    it 'multiple events', ->
      book.on 'change:title', changeTitle
      book.title = 'x'
      book.title = 'y'
      book.title = 'z'

      expect(changeTitle.callCount).eq 3
