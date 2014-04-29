require './setup'

describe 'use', ->
  it 'basic use', ->
    msg = ''

    Person = ento().use
      greet: ->
        msg += "Hello, #{@name}"

    new Person(name: "Jake").greet()
    expect(msg).to.eq "Hello, Jake"

  it 'multiple', ->
    Armored = { armor: -> 200 }
    Villain = { alignment: -> 'evil' }

    Unit = ento()
      .use(Villain)
      .use(Armored)

    mob = new Unit()

    expect(mob.alignment()).eq 'evil'
    expect(mob.armor()).eq 200

  it 'static props', ->
    Unit = ento()
      .use(null, foo: true)

    expect(Unit.foo).eq true

  it 'fn', ->
    Armored = (model) ->
      model
        .attr('armor')
        .attr('hasArmor', -> @armor > 0)
      
    Unit = ento().use(Armored)
    mob = new Unit(armor: 0)

    expect(mob.armor).eq 0
    expect(mob.hasArmor).eq false

  it 'invalid, null', ->
    expect(-> ento().use(null)).throw /invalid arg/

  it 'invalid, undefined', ->
    expect(-> ento().use(undefined)).throw /invalid arg/
