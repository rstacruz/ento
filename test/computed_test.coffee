require './setup'

Name = null
me = null

describe 'computed properties', ->
  describe 'definition', ->
    it '.attr(name, [deps]) syntax', ->
      Name = Ento()
        .attr('full', ['first','last'], ->)

      expect(Name.attributes.full.via).be.like ['first', 'last']

    it 'normalize cases', ->
      Name = Ento()
        .attr('full_name', ['first_name','lastName'], ->)

      expect(Name.attributes.fullName.via).be.like ['firstName', 'lastName']

  describe 'in practice', ->
    beforeEach ->
      Name = Ento()
        .attr('first')
        .attr('last')
        .attr 'full', via: ['first', 'last'], ->
          [@first, @last].join(' ')

      me = new Name(first: "Jack", last: "Harkness")
      me
        .on('change', spy('change'))
        .on('change:last', spy('change:last'))
        .on('change:full', spy('change:full'))

    it 'works', ->
      expect(me.full).eql "Jack Harkness"

    it 'Model.attributes', ->
      expect(Name.attributes.full.via).be.like ['first', 'last']

    it 'responds to change', ->
      me.last = "Johnson"
      expect(me.full).eql "Jack Johnson"

    it 'change event', ->
      me.last = "Skelington"
      expect(spy('change')).calledOnce

    it 'change event tells us what changed', ->
      me.last = "Skelington"
      expect(spy('change').firstCall.args[0]).like ['last']

    it 'change:attr event', ->
      me.last = "Skelington"
      expect(spy('change:last')).calledOnce

    it 'change:attr event of the dynamic attr', ->
      me.last = "Skelington"
      expect(spy('change:full')).calledOnce
