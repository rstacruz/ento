/***
 * Relations:
 * You can describe relations.
 *
 *   Book = Ento()
 *     .use(Ento.relations)
 *     .hasOne('author', { as: 'book' }, function() { return Person; })
 *
 *   Person = Ento()
 *     .hasOne('book', { as: 'author' }, function() { return Book; })
 */

module.exports = function (_, camelize) {
  return function (model) {
    /**
     * hasOne:
     * creates a relation.
     *
     *     book.author = {...}
     *     // will:
     *     // - create an instance of 'Person' as needed
     *     // - update `child.book` to the parent book
     *     // - link `book.author_id` to that author instance
     *     
     */
 
    model.hasOne = function (attr, options, klass) {
      hasOneAttribute(attr, options, klass);
      return this;
    };

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
          if (child[options.as] !== this)
            child[options.as] = this;

          return;
        }
      });
    }
      
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
