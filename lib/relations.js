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

module.exports = function (_, camelize) {
  return function (model) {

    /**
     * hasOne : hasOne(attribute, options, class)
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
     * The parameter `class` is a function that returns a class, such as
     * *function() { return Book; }*. The reason for this is that it lets Ento
     * lazy-load the class only when it's needed, allowing you to create
     * circular relationships (eg: Album has many Songs, and Song has one
     * Album).
     *
     *   var Answer = function() { return require('./answer'); }
     *
     *   Question = Ento()
     *     .use(Ento.relations)
     *     .hasOne('answer', {as: 'question'}, Answer);
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
 
    model.hasOne = function (attr, options, klass) {
      hasOneAttribute(attr, options, klass);
      return this;
    };

    /*
     * belongsTo:
     * Creates a relation. Works exactly like hasOne, but also accounts for a
     * `child_id` attribute.
     *
     *   book.author = { id: 3, name: 'John' }
     *   book.author_id //=> 3
     */
    
    model.belongsTo = function (attr, options, klass) {
      hasOneAttribute(attr, options, klass);
      hasOneId(attr, options, klass);
      return this;
    };

    /*
     * relation
     */
    
    function hasOneAttribute (attr, options, klass) {
      attr = camelize(attr);

      model.attr(attr, {
        set: function (value) {
          var child, parent = this;

          // .author = null
          if (!value) {
            this.raw[attr] = undefined;
            return;
          }

          // .author = 12345
          if (typeof value !== 'object')
            throw new Error("not an object");

          // .author = { ... } - instanciate as needed
          // .author = Author(...)
          if (value.constructor === Object)
            child = new (klass())(value);
          else if (value instanceof klass())
            child = value;
          else
            throw new Error("wtf is that");

          // set model instance (`.author = ...`)
          this.raw[attr] = child;

          // propagate back if needed
          if (options.as && child[options.as] !== this)
            child[options.as] = this;

          return;
        }
      });
    }
      
    /*
     * (internal) creates a `attr_id` attribute
     */
    
    function hasOneId (attr, options, klass) {
      attr = camelize(attr);
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
        json: true,
        export: true
      });
    }

  };
};
