/***
 * Relations:
 * You can describe relations.
 *
 *   Book = Ento()
 *     .use(Ento.relations)
 *     .hasOne('author', function() { return Author; })
 */

module.exports = function (_, camelize) {
  return function (model) {
    /**
     * hasOne:
     * creates a relation
     */
 
    model.hasOne = function (attr, options, klass) {
      if (arguments.length === 2) {
        klass = options;
        options = undefined;
      }

      relation('hasOne', attr, options, klass);

      return this;
    };

    /*
     * relation
     */
    
    function relation (type, attr, options, klass) {
      attr = camelize(attr);
      var attrId = attr + 'Id';

      model.attr(attr, {
        set: function (value) {
          var child, parent = this;

          // remove previous bindings
          if (this.raw[attr])
            this.stopListening(this.raw[attr]);

          // .author = null
          if (!value) {
            this.raw[attr] = undefined;
            return;
          }

          // .author = 12345
          if (typeof value !== 'object')
            throw new Error("not an object");

          // .author = { ... }
          if (value.constructor === Object) {
            // intstanciate
            child = new (klass())(value);
          } else if (value instanceof klass()) {
            child = value;
          } else {
            throw new Error("wtf is that");
          }

          // set instance
          this.raw[attr] = child;
          child[options.inverse] = this;

          // listen to id
          parent.setOne(attrId, value.id);
          this.listenTo(child, 'change:id', function(id) {
            parent.setOne(attrId, id);
          });

          return;
        }
      });
      
      model.attr(attrId, {
        set: function (value) {
          // set it
          this.raw[attrId] = value;

          // set the author as well
          var child = this.get(attr);
          if (!child || !child.id || child.id !== value)
            this.setOne(attr, { id: value });
        }
      });
    }

  };
};
