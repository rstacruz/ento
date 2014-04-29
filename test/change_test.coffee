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
      book.on 'change:title', changeTitle
      book.on 'change', change

    it 'setter', ->
      book.title = 'x'
      expect(changeTitle.calledOnce).true
      expect(change.calledOnce).true

    it '.set()', ->
      book.set 'title', 'x'
      expect(changeTitle.calledOnce).true
      expect(change.calledOnce).true

    it '.set(object)', ->
      book.set title:  'x'
      expect(changeTitle.calledOnce).true
      expect(change.calledOnce).true

    it '.set(k, v, silent)', ->
      book.set 'title', 'x', silent: true
      expect(changeTitle.called).false
      expect(change.called).false

    it '.set(object, silent)', ->
      book.set { title: 'x' }, silent: true
      expect(changeTitle.called).false
      expect(change.called).false

    it 'multiple setters', ->
      book.title = 'x'
      book.title = 'y'
      expect(changeTitle.callCount).eq 2

    it 'multiple .set()', ->
      book.set 'title', 'x'
      book.set 'title', 'y'
      expect(changeTitle.callCount).eq 2
      expect(change.callCount).eq 2
