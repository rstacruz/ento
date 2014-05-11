/***
 * Relations:
 * You can describe relations using [hasOne], [hasMany], and [belongsTo].
 *
 *   Person = Ento()
 *     .use(Ento.relations)
 *     .hasOne('book', { as: 'author' }, function() { return Book; })
 *
 *   Book = Ento()
 *     .use(Ento.relations)
 *     .belongsTo('author', { as: 'book' }, function() { return Person; })
 */

module.exports = function (Ento) {
  var _ = Ento._;

  return function (model) {

    /**
     * hasOne : hasOne(attribute, class, options)
     * Creates a relation. See [Relations] for an example.
     *
     * The `options` parameter can have:
     *
     * ~ as (string): the name of the attribute in the child class that
     * describes the inverse relationship.
     *
     * This creates a custom attribute. When set, it will automatically
     * instanciate it.
     *
     *   q = new Question({ title: 'Why is the sky blue?' });
     *   q.answer = { body: 'It reflects the ocean' };
     *
     *   q.answer // is of type `Answer`
     *
     * The parameter `class` is a model class (like an Ento class).
     *
     *   Question = Ento()
     *     .use(Ento.relations)
     *     .hasOne('answer', Answer, {as: 'question'});
     *
     * If `as` is given, the child will be updated to have a link to the
     * parent. In the example above, you can:
     *
     *   q = new Question({ title: 'Why is the sky blue?' });
     *   q.answer = { body: 'It reflects the ocean' };
     *
     *   // `.question` is automatically set, because of `as: 'question'`
     *   q.answer.question == q
     *
     * Another example:
     *
     *   book.author = { id: 3, name: 'Jake' }
     *   book.author       // is of type `Person`
     *   book.author.book  // link to parent `book`
     *     
     */
 
    model.hasOne = function (attr, klass, options) {
      hasOneAttribute(attr, klass, options, true);
      return this;
    };

    /**
     * belongsTo : belongsTo(attribute, options, class)
     * Creates a relation. Works exactly like [hasOne], but also accounts for a
     * *child_id* attribute.
     *
     * See [hasOne] for documentation on how *belongsTo* works.
     *
     *   book.author = { id: 3, name: 'John' }
     *   book.author_id //=> 3
     */
    
    model.belongsTo = function (attr, klass, options) {
      hasOneAttribute(attr, klass, options, false);
      hasOneId(attr, klass, options);
      return this;
    };

    /*
     * creates the attribute 'attr' representing the sub-object
     */
    
    function hasOneAttribute (attr, klass, options, exportable) {
      attr = Ento.camelize(attr);

      model.attr(attr, {
        set: function (value) {
          var child, parent = this;

          // if there's an existing object, unhook it first
          if (exportable)
            this.stopListening(child, 'change');

          // .author = null
          if (!value) {
            this.raw[attr] = undefined;
            return;
          }

          // .author = 12345
          if (typeof value !== 'object')
            throw new Error("Ento.relation: not an object");

          // .author = { ... } - instanciate as needed
          // .author = Author(...)
          if (value.constructor === Object)
            child = new klass(value);
          else if (value instanceof klass)
            child = value;
          else
            throw new Error("Ento.relation: not an instance of the given class");

          // set model instance (`.author = ...`)
          this.raw[attr] = child;

          // propagate `change` event, but only for hasOne
          // TODO: why are you checking 'exportable'? refactor that
          if (exportable) {
            this.listenTo(child, 'change', function () {
              parent.trigger('change:'+attr, parent.get(attr));
              parent.trigger('change');
            });
          }

          // propagate back if needed
          if (options.as && child[options.as] !== this)
            child[options.as] = this;

          return;
        },

        // show up in serialization only for `hasOne`
        json: exportable
      });
    }
      
    /*
     * (internal) creates a `attr_id` attribute
     */
    
    function hasOneId (attr, klass, options) {
      attr = Ento.camelize(attr);
      var attrId = attr + 'Id';

      model.attr(attrId, {
        set: function (value) {
          // set the model if needed (`.author = {id:300}`)
          // this should automatically instanciate it thru the other getter
          var child = this.get(attr);
          if (!child || !child.id || child.id !== value)
            this.setOne(attr, { id: value });
        },

        get: function () {
          // assume the model attribute is available (`.author`), and just
          // get the id from there (`.author.id`)
          var child = this.get(attr);
          if (child) return child.id;
        },

        // show up in serialization
        json: true
      });
    }

  };
};
