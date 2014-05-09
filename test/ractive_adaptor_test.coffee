require './setup'

Name = null
user = null
view = null

describe 'ractive adaptor', ->
  require('./support/ractive')()

  beforeEach 'build the class', ->
    Name = Ento()
      .attr('first')
      .attr('last')
      .attr('full', ['first', 'last'], -> [@first, @last].join(' '))

  beforeEach 'instanciate it', ->
    user = new Name(first: "Jack", last: "Frost")

  beforeEach 'make a Ractive view', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{ user.full }}</div>'
      adapt: ['ento']
      data: { user: user }

  describe 'ractive reset', ->
    it 'should work with set(object)', ->
      view.set('user', { first: 'Harry', last: 'Lemon' })
      expect(html()).eql '<div>Harry Lemon</div>'

    it 'should work with set(ento object)', ->
      view.set('user', new Name(first: 'Harry', last: 'Lemon'))
      expect(html()).eql '<div>Harry Lemon</div>'

  describe 'teardown', ->
    it 'unbind change handlers', ->
      user.on 'change', ->
      expect(user._events.change).have.length 2
      view.teardown()
      expect(user._events.change).have.length 1

  describe 'manually invoking the change event', ->
    beforeEach 'manually modify the raw data', ->
      expect(html()).eql '<div>Jack Frost</div>'
      user.raw.last = 'Black'
      expect(html()).eql '<div>Jack Frost</div>'

    it 'should respond to manually-invoked change events', ->
      user.trigger('change')
      expect(html()).eql '<div>Jack Black</div>'

  describe 'manually invoking the change event', ->
    beforeEach 'manually modify the raw data', ->
      expect(html()).eql '<div>Jack Frost</div>'
      user.raw.last = 'Black'
      expect(html()).eql '<div>Jack Frost</div>'

    it 'should respond to manually-invoked change events', ->
      user.trigger('change')
      expect(html()).eql '<div>Jack Black</div>'
