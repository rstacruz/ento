module.exports = ->
  before (done) ->
    require('jsdom').env
      html: '<body>',
      done: (err, window) ->
        if err
          console.error(err)
          return done(err)
        global.window = window
        global.document = window.document
        global.history = window.history
        window.console = console
        done()

  before ->
    global.html = -> document.body.innerHTML

  beforeEach ->
    document.body.innerHTML = ''

