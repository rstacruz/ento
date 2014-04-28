(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory); /* AMD */
  } else if (typeof exports === 'object') {
    module.exports = factory(underscore()); /* CommonJS */
  } else {
    root.Ostruct = factory(underscore()); /* Globals */
  }

  function underscore() {
    try { return require('underscore'); }
    catch (e) { return root._; }
  }

}(this, function (_) {

  if (!_) throw new Error("Ostruct: underscore.js not found.");

  var Resource;

  function Ostruct() {
    return Resource.extend();
  }

  Ostruct.events = require('./lib/events')(_);
  Ostruct.persistence = require('./lib/persistence');

  /**
   * Resource.
   */

  Resource = function () {
    var api, options;

    // determine the params (api, options)
    for (var i=0, len=arguments.length; i<len; i++) {
      if (i === 0 && arguments[0] && arguments[0].sync) {
        api = arguments[0];
      } else if (typeof arguments[i] === 'object' && !options) {
        options = arguments[i];
      }
    }

    /** is: states */
    this.is = { fresh: true };

    /** api: Root instance */
    this.api = api;

    /** raw: raw data */
    this.raw = {};

    if (options) this.set(options);
    this.init(options);
  };

  Resource.prototype = {
    /**
     * Sorta constructor
     */

    init: function (options) {
    },

    /**
     * set : set(key, value)
     * Sets a `key` to `value`. If a setter function is available, use it.
     */

    set: function (key, value) {
      // handle objects (.set({...}))
      if (arguments.length === 1 && typeof key === 'object') {
        for (var k in key) {
          if (key.hasOwnProperty(k)) this.set(k, key[k]);
        }
        return;
      }

      // set raw; use the setter
      this[key] = value;
    },

    /**
     * setRaw : setRaw(key, value, options)
     * Sets the attribute `key` to the value of `value`. This is what dynamic
     * setters delegate to.
     *
     * This also triggers the `change:xxx` event.
     *
     *     item.setRaw('name', 'John');
     *
     */
    setRaw: function (key, value, options) {
      this.raw[key] = value;
      this.trigger('change:'+key, value);
    }
  };

  Resource.extended = function () {
    /**
     * properties : Array
     * List of properties.
     */

    this.properties = {};
  };

  Resource.extended();

  /**
   * attr : attr(name, [...])
   * Registers an attribute.
   *
   * Can be called as:
   *
   *     attr('name')
   *     attr('name', function())
   *     attr('name', function(), function())
   *     attr('name', String|Boolean|Date|Number)
   *     attr('name', { options })
   */

  Resource.attr = function (name) {
    // parse arguments into options
    var options = {};
    for (var i=1, len=arguments.length; i<len; i++) {
      var arg = arguments[i];
      if (typeof arg === 'object') {
        _.extend(options, arg);
      } else if (arg === Number || arg === String || arg === Date || arg === Boolean) {
        options.type = arg;
      } else if (typeof arg === 'function') {
        if (!options.get) options.get = arg;
        else if (!options.set) options.set = arg;
      }
    }

    if (typeof options.enumerable === 'undefined')
      options.enumerable = true;

    this.properties[name] = options;

    var props = {
      enumerable: options.enumerable,
      get: options.get ||
        (options.type ?
          function () { return coerce(this.raw[name], options.type); } : null) ||
        function () { return this.raw[name]; },
      set: function (value) {
        if (options.set) {
          options.set.call(this, value);
          this.trigger('change:'+name, value);
        } else {
          this.setRaw(name, value);
        }
      }
    };

    var names = _.uniq([
      name,
      camelize(name),
      underscored(name)
    ]);

    for (var i=0, len=names.length; i<len; i++) {
      Object.defineProperty(this.prototype, names[i], props);
    }

    return this;
  };

  /**
   * propertyNames:
   * returns property names.
   *
   *     Name = ostruct()
   *       .attr('first')
   *       .attr('last');
   *
   *    Name.propertyNames();
   *    => ['first', 'last']
   */

  Resource.propertyNames = function () {
    return _.keys(this.properties);
  };

  /**
   * use : use(...)
   * uses a mixin.
   *
   * ~ use(props, [staticProps]) :
   *   extends the prototype with `props`. optionally, you can pass
   *   `staticProps` too to extend the object itself.
   * ~ use(fn) :
   *   call the function `fn`, passing the model as the first argument. This
   *   allows you to extend the class in whatever way you wish.
   *
   * Example:
   *
   *     var Person = ostruct()
   *       .attr('name')
   *       .use({
   *         greet: function() {
   *           alert("Hello, " + this.name);
   *         }
   *       })
   *
   * Or as a function:
   *
   *     var Timestamps = function (model) {
   *       model
   *         .attr('createdAt')
   *         .attr('updatedAt');
   *     }
   *
   *     var Record = ostruct().use(Timestamps);
   */

  Resource.use = function (props, staticProps) {
    if (typeof props === 'function') {
      props.call(this, this);
    }
    else if (typeof props === 'object') {
      _.extend(this.prototype, props);
    }
    if (typeof staticProps === 'object') {
      _.extend(this, staticProps);
    }

    return this;
  };

  /**
   * extend : extend(props)
   * Subclasses `Resource` into a new class.
   */

  Resource.extend = require('./lib/extend')(_);

  function camelize (str) {
    return str.trim().replace(/[-_\s]+(.)?/g, function (match, c) { return c.toUpperCase(); });
  }

  function underscored (str) {
    return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[\.-\s]+/g, '_').toLowerCase();
  }

  /**
   * coerce : coerce(value, type)
   * (internal) coerces a `value` into a type `type`.
   *
   *     coerce("200", Number);   => 200
   *     coerce(200, String);     => "200"
   *     coerce("yes", Boolean);  => true
   */

  function coerce (value, type) {
    if (value === null || typeof value === 'undefined') return value;

    if (type === String) return "" + value;
    if (type === Number) return +value;
    if (type === Date) return new Date(value);
    if (type === Boolean) {
      if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value === '1' || value === 'yes' || value === 'true')
          return true;
        else if (value === '0' || value === 'no' || value === 'false' || value === '')
          return false;
      } else if (typeof value === 'number') {
        return value !== 0;
      } else {
        return !!value;
      }
    }
  }

  _.extend(Resource.prototype, Ostruct.events);
  Ostruct.object = Resource;

  return Ostruct;

}));
