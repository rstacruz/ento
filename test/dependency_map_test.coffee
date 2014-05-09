describe 'dependency map', ->
  Depmap = require('../lib/dependency_map')

  beforeEach ->
    @deps = new Depmap()
    @deps.add 'full', ['first', 'last']
    @deps.add 'first', ['prefix', 'nick']

  describe 'dependents', ->
    it 'simple', ->
      items = @deps.dependents('first')
      expect(items).like ['first', 'full']

    it 'deep', ->
      items = @deps.dependents('nick')
      expect(items).like ['nick', 'full', 'first']

    it 'array', ->
      items = @deps.dependents(['nick'])
      expect(items).like ['nick', 'full', 'first']

    it 'array with dupes', ->
      items = @deps.dependents(['nick', 'nick'])
      expect(items).like ['nick', 'full', 'first']

    it 'nonexistent', ->
      items = @deps.dependents('middle')
      expect(items).like ['middle']

  describe 'dependencies', ->
    it 'simple', ->
      items = @deps.dependencies('first')
      expect(items).like ['first', 'prefix', 'nick']

    it 'array', ->
      items = @deps.dependencies(['first', 'last'])
      expect(items).like ['first', 'prefix', 'nick', 'last']

    it 'deep', ->
      items = @deps.dependencies('full')
      expect(items).like ['full', 'prefix', 'nick', 'first', 'last']

    it 'nonexistent', ->
      items = @deps.dependencies('suffix')
      expect(items).like ['suffix']
