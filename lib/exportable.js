module.exports = function (model) {
  model.use({
    export: function() {
      var obj = {};
      var props = this.constructor.properties;
      for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
          var options = props[prop];
          if (options.enumerable !== false && options.exportable !== false) {
            obj[prop] = this[prop];
          }
        }
      }
      return obj;
    }
  });
};
