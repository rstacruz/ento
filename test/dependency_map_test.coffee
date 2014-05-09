describe 'dependency map', ->
  Depmap = require('../lib/dependency_map')

  beforeEach ->
    @deps = new Depmap()
    @deps.add 'full', ['first', 'last']
    @deps.add 'first', ['prefix', 'nick']

  it 'dependents', ->
    items = @deps.dependents('first')
    expect(items).like ['full']

  it 'dependents, deep', ->
    items = @deps.dependents('nick')
    expect(items).like ['full', 'first']

  xit 'dependencies', ->
    items = @deps.dependencies('first')
    expect(items).like ['prefix', 'nick']

  xit 'dependencies, deep', ->
    items = @deps.dependencies('full')
    expect(items).like ['first', 'last', 'prefix', 'nick']
