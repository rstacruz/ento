require './setup'

Name = null
user = null
view = null

describe 'ractive computed properties', ->
  require('./support/ractive')()

  beforeEach 'build the class', ->
    Name = Ento()
      .attr('first')
      .attr('last')
      .attr('full', ['first','last'], -> [@first, @last].join(' '))

  beforeEach 'instanciate it', ->
    user = new Name(first: "Jack", last: "Frost")

  beforeEach 'make a Ractive view', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{ user.full }}</div>'
      adapt: ['ento']
      data: { user: user }

  it 'should work', ->
    expect(document.body.innerHTML).eql '<div>Jack Frost</div>'

  it 'changes the DOM when an update happens', ->
    user.last = "Johnson"
    expect(document.body.innerHTML).eql '<div>Jack Johnson</div>'

  it 'ractive.set should propagate to the model', ->
    view.set('user.last', 'Crawford')
    expect(user.full).eql 'Jack Crawford'

  it 'ractive.set should rerender computed fields', ->
    view.set('user.last', 'Black')
    expect(document.body.innerHTML).eql '<div>Jack Black</div>'

  describe 'teardown should unbind event handlers', ->
    it 'remove the change handler', ->
      expect(user._events.change).not.be.undefined
      view.teardown()
      expect(user._events.change).be.undefined

    it 'leave another change handler unharmed', ->
      user.on 'change', ->
      expect(user._events.change).have.length 2
      view.teardown()
      expect(user._events.change).have.length 1
