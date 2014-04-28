module.exports = {

  /**
   * export : export()
   * exports all attributes into an object, including dynamic properties.
   */

  export: function() {
    var obj = {};
    var props = this.constructor.properties;

    // propagate properties
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var options = props[prop];
        if (options.enumerable !== false && options.exportable !== false) {
          obj[prop] = this[prop];
        }
      }
    }

    // propagate state
    obj.is = this.is;

    return obj;
  }
};

