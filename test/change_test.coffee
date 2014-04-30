require './setup'

changeTitle = null
change = null
modelChange = null
modelChangeTitle = null
Book = null
book = null

describe 'change', ->

  beforeEach ->
    changeTitle = sinon.spy()
    change = sinon.spy()
    modelChange = sinon.spy()
    modelChangeTitle = sinon.spy()

  beforeEach ->
    Book = ento().attr('title')
    book = new Book()
      .on('change', modelChange)
      .on('change:title', modelChangeTitle)
    book.on 'change:title', changeTitle
    book.on 'change', change

  it 'setter', ->
    book.title = 'x'
    expect(changeTitle.calledOnce).true
    expect(change.calledOnce).true

  describe '.set()', ->
    beforeEach ->
      book.set 'title', 'x'

    it 'change:title', ->
      expect(changeTitle).calledOnce
      expect(changeTitle).calledWith 'x'

    it 'change', ->
      expect(change).calledOnce
      expect(change).calledWith title: 'x'

    it 'model change', ->
      expect(modelChange).calledOnce
      expect(modelChange).calledWith title: 'x'
      expect(modelChange.firstCall.thisValue).eq book

    it 'model change:title', ->
      expect(modelChangeTitle).calledOnce
      expect(modelChangeTitle).calledWith 'x'
      expect(modelChangeTitle.firstCall.thisValue).eq book

  describe '.set(object)', ->
    beforeEach ->
      book.set title: 'x'

    it 'change:title', ->
      expect(changeTitle).calledOnce
      expect(changeTitle).calledWith 'x'

    it 'change', ->
      expect(change).calledOnce
      expect(change).calledWith title: 'x'

    it 'model change', ->
      expect(modelChange).calledOnce

    it 'model change:title', ->
      expect(modelChangeTitle).calledOnce
      expect(modelChangeTitle).calledWith 'x'
      expect(modelChangeTitle.firstCall.thisValue).eq book

  it '.set(k, v, silent)', ->
    book.set 'title', 'x', silent: true
    expect(changeTitle).not.called
    expect(change).not.called

  it '.set(object, silent)', ->
    book.set { title: 'x' }, silent: true
    expect(changeTitle).not.called
    expect(change).not.called

  it 'multiple setters', ->
    book.title = 'x'
    book.title = 'y'
    expect(changeTitle).calledTwice

  it 'multiple .set()', ->
    book.set 'title', 'x'
    book.set 'title', 'y'
    expect(changeTitle).calledTwice
    expect(change).calledTwice
