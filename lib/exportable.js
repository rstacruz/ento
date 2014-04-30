module.exports = {

  /**
   * export : export()
   * exports all attributes into an object, including dynamic attributes.
   */

  export: function() {
    var obj = {};
    var attrs = this.constructor.attributes;

    // attragate attributes
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        var options = attrs[attr];
        if (options.enumerable !== false && options.exportable !== false) {
          obj[attr] = this[attr];
        }
      }
    }

    // propagate state. this is not an enumerable property.
    obj.is = this.is;

    return obj;
  }
};

