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
    view.set('user.last', 'Crawford')
    expect(document.body.innerHTML).eql '<div>Jack Crawford</div>'
