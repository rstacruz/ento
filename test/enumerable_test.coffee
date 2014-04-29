require './setup'

describe 'enumerable', ->
  it 'ok', ->
    Song = ento()
      .attr('title', enumerable: false)
      .attr('artist')

    song = new Song(title: 'x', artist: 'y')

    keys = []
    for key of song
      keys.push key

    expect(keys).not.include 'title'
    expect(keys).include 'artist'
