require './setup'

db = null

describe 'api', ->
  afterEach ->
    Ento.object.api(undefined)

  describe 'mock', ->
    beforeEach ->
      db = { foo: 200 }
      Ento.object.api(db)

    it 'api is accessible in model', ->
      Model = Ento()
      expect(Model.api()).eql db

    it 'api is accessible in instance', ->
      Model = Ento()
      instance = new Model()
      expect(instance.api).eql db

    it 'modifying api in model', ->
      db2 = { foo: 300 }

      Model = Ento().api(db2)
      instance = new Model()
      expect(instance.api.foo).eql 300

    it "modifying api in model doesn't affect others", ->
      db2 = { foo: 300 }

      Other = Ento()
      Model = Ento().api(db2)
      instance = new Model()

      expect(new Other().api).eql db
      expect(new Model().api).eql db2
