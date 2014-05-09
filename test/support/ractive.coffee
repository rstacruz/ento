module.exports = ->
  require('./jsdom')()

  before ->
    global.Ractive = require('ractive')

  before ->
    global.Ractive.adaptors.ento = Ento.ractiveAdaptor
