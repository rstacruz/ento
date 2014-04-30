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
