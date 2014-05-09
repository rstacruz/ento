require './setup'

user = null
view = null

describe 'ractive computed properties', ->
  require('./support/ractive')()

  beforeEach ->
    user = Ento()
      .use(Ento.exportable)
      .attr('first')
      .attr('last')
      .attr('full', ['first','last'], -> [@first, @last].join(' '))
      .build(first: "Jack", last: "Frost")

    view = new Ractive
      el: 'body'
      template: '<div>{{user.full}}</div>'
      adapt: ['ento']
      data: { user: user }

  it 'should work', ->
    expect(document.body.innerHTML).eql '<div>Jack Frost</div>'

  it 'changes', ->
    user.last = "Johnson"
    expect(document.body.innerHTML).eql '<div>Jack Johnson</div>'
