require './setup'

Name = null
item = null

describe 'getter', ->
  describe 'getter', ->
    beforeEach ->
      Name = ostruct()
        .attr('first')
        .attr('last')
        .attr('full', -> "#{@first} #{@last}")

    it 'works', ->
      item = new Name(first: 'Miles', last: 'Davis')
      expect(item.full).eq 'Miles Davis'

  it 'getter, alt syntax', ->
    Name = ostruct()
      .attr('first')
      .attr('last')
      .attr('full', get: -> "#{@first} #{@last}")

    item = new Name(first: 'Miles', last: 'Davis')
    expect(item.full).eq 'Miles Davis'

  it 'setter', (done) ->
    Name = ostruct()
      .attr('first', set: -> done())

    item = new Name()
    item.first = 'Peter'
