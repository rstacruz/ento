require './setup'

Song = null
Album = null
spy = null

describe 'has one change', ->
  beforeEach ->
    Song = Ento()
      .use(Ento.relations)
      .attr('id')
      .attr('title')

    Album = Ento()
      .use(Ento.relations)
      .attr('id')
      .hasOne('song', as: 'album', Song)

  describe 'propagate change event of children', ->
    beforeEach ->
      spy = sinon.spy()

    it 'one level, change:attr', ->
      parent = new Album()
      parent.song = new Song(title: 'Wrecking Ball')
      parent.on('change:song', spy)
      parent.song.title = 'Party in the USA'
      expect(spy).calledOnce

    it 'one level, change', ->
      parent = new Album()
      parent.song = new Song(title: 'Wrecking Ball')
      parent.on('change', spy)
      parent.song.title = 'Party in the USA'
      expect(spy).calledOnce
