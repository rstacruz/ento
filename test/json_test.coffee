require './setup'

describe 'json', ->
  it 'ok with extra values', ->
    obj = Ento().build(a: 1, b: 2)

    expect(JSON.stringify(obj)).eql '{"a":1,"b":2}'

  it 'keys', ->
    obj = Ento().build(a: 1, b: 2)
    expect(Object.keys(obj)).be.like ['a', 'b']

  it 'defined attrs', ->
    obj = Ento()
      .attr('name')
      .build(name: "John")

    expect(JSON.stringify(obj)).be.like '{"name":"John"}'

  it 'ISO string dates', ->
    obj = Ento()
      .attr('date', Date)
      .build(date: new Date("2010-01-01Z"))

    expect(JSON.stringify(obj)).be.like '{"date":"2010-01-01T00:00:00.000Z"}'

  it 'numbers', ->
    obj = Ento()
      .attr('number', Number)
      .build(number: 0o100)

    expect(JSON.stringify(obj)).be.like '{"number":64}'

  it 'boolean', ->
    obj = Ento()
      .attr('bool', Boolean)
      .build(bool: "1")

    expect(JSON.stringify(obj)).be.like '{"bool":true}'

  it 'json: false', ->
    obj = Ento()
      .attr('name')
      .attr('age', json: false)
      .build(name: "John", age: 12)

    expect(JSON.stringify(obj)).be.like '{"name":"John"}'

  it 'defined attrs with extra values', ->
    obj = Ento()
      .attr('name')
      .build(age: 12, name: "John")

    expect(JSON.stringify(obj)).be.like '{"age":12,"name":"John"}'
