require './setup'

Person = null
user = null
view = null

describe 'ractive', ->
  require('./support/ractive')()

  it 'ensure ractive works', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{x}}</div>'

    view.set x: 'hello'
    expect(document.body.innerHTML).eql '<div>hello</div>'

  beforeEach 'try to build', ->
    Person = Ento()
      .use(Ento.exportable)
      .attr('name')

    user = new Person(name: "Jack", lastname: "Frost")

  it 'works with ractive by default', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{ user.name }}</div>'
      data: { user: user }

    expect(document.body.innerHTML).eql '<div>Jack</div>'

  it 'works with ractive as an adaptor', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{ user.name }}</div>'
      data: { user: user }
      adapt: ['ento']

    user.name = "Jacques"
    expect(document.body.innerHTML).eql '<div>Jacques</div>'
