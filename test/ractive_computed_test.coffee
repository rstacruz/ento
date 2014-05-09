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
      .attr('full', ['first', 'last'], -> [@first, @last].join(' '))

  beforeEach 'instanciate it', ->
    user = new Name(first: "Jack", last: "Frost")

  beforeEach 'make a Ractive view', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{ user.full }}</div>'
      adapt: ['ento']
      data: { user: user }

  it 'should work', ->
    expect(html()).eql '<div>Jack Frost</div>'

  it 'changes the DOM when an update happens', ->
    user.last = "Johnson"
    expect(html()).eql '<div>Jack Johnson</div>'

  describe 'ractive.set', ->
    beforeEach ->
      view.set('user.last', 'Crawford')

    it 'should propagate to the model', ->
      expect(user.full).eql 'Jack Crawford'

    it 'should rerender computed fields', ->
      expect(html()).eql '<div>Jack Crawford</div>'
