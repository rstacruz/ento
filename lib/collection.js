module.exports = function (Ento) {
  var _ = Ento._;

  return function(Model) {
    Model.attr('items');

    // length
    Model.attr('length', ['items'], function () {
      return this.items && this.items.length || 0;
    });

    Model.on('init', function () {
      this.raw.items = [];
    });

    Model.use({
      setArray: function (list) {
        // to do
        this.set('items', list);
      },

      push: function (item) { },
      pop: function (options) { },
      shift: function (options) { },
      unshift: function (options) { },
      slice: function () { },
      at: function (idx) {
        return this.get('items')[idx];
      }
    });

    // use underscore methods
    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
      'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
      'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
      'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
      'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
      'lastIndexOf', 'isEmpty', 'chain', 'sample'];

    _.each(methods, function(method) {
      Model.prototype[method] = function() {
        var args = [].slice.call(arguments);
        args.unshift(this.get('items') || []);
        return _[method].apply(_, args);
      };
    });

  };
};
