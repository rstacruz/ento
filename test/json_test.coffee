require './setup'

describe 'json', ->
  it 'ok with extra values', ->
    obj = Ento().build(a: 1, b: 2)

    expect(JSON.stringify(obj)).eql '{"a":1,"b":2}'

  it 'keys', ->
    obj = Ento().build(a: 1, b: 2)
    expect(Object.keys(obj)).be.like ['a', 'b']

  xit 'keys of defined attrs', ->
    obj = Ento()
      .attr('name')
      .build(name: "John")

    expect(Object.keys(obj)).be.like ['name']

  xit 'ok with attrs', ->
    obj = Ento()
      .attr('name')
      .build(name: "John")

    expect(JSON.stringify(obj)).eql '{"name":"John"}'
