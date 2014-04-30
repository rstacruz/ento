require './setup'

describe 'ractive', ->
  require('./support/jsdom')()

  before ->
    global.Ractive = require('ractive')

  it 'ensure ractive works', ->
    view = new Ractive
      el: 'body'
      template: '<div>{{x}}</div>'

    view.set x: 'hello'
    expect(document.body.innerHTML).eql '<div>hello</div>'

