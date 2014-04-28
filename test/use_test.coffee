require './setup'

describe 'use', ->
  it 'basic use', ->
    msg = ''

    Person = ostruct().use
      greet: ->
        msg += "Hello, #{@name}"

    new Person(name: "Jake").greet()
    expect(msg).to.eq "Hello, Jake"

  it 'multiple', ->
    Armored = { armor: -> 200 }
    Villain = { alignment: -> 'evil' }

    Unit = ostruct()
      .use(Villain)
      .use(Armored)

    mob = new Unit()

    expect(mob.alignment()).eq 'evil'
    expect(mob.armor()).eq 200

  it 'static props', ->
    Unit = ostruct()
      .use(null, foo: true)

    expect(Unit.foo).eq true

  it 'fn', ->
    Armored = (model) ->
      model
        .attr('armor')
        .attr('hasArmor', -> @armor > 0)
      
    Unit = ostruct().use(Armored)
    mob = new Unit(armor: 0)

    expect(mob.armor).eq 0
    expect(mob.hasArmor).eq false
