require './setup'

Name = null
item = null

describe 'getter', ->
  describe 'getter', ->
    beforeEach ->
      Name = ento()
        .attr('first')
        .attr('last')
        .attr('full', -> "#{@first} #{@last}")

    it 'works', ->
      item = new Name(first: 'Miles', last: 'Davis')
      expect(item.full).eq 'Miles Davis'

  it 'getter, alt syntax', ->
    Name = ento()
      .attr('first')
      .attr('last')
      .attr('full', get: -> "#{@first} #{@last}")

    item = new Name(first: 'Miles', last: 'Davis')
    expect(item.full).eq 'Miles Davis'

  it 'setter', (done) ->
    Name = ento()
      .attr('first', set: -> done())

    item = new Name()
    item.first = 'Peter'
