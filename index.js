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

    // determine stuff
    for (var i=0, len=arguments.length; i<len; i++) {
      if (i === 0 && arguments[0] && arguments[0].sync) {
        api = arguments[0];
      } else if (typeof arguments[i] === 'object' && !options) {
        options = arguments[i];
      }
    }

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

    this.properties = [];
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

    this.properties.push(name);

    var props = {
      enumerable: true,
      get: options.get || function () {
        return this.raw[name];
      },
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
   * use : use(object, [...])
   * yep.
   */

  Resource.use = function () {
    for (var i=0, len=arguments.length; i<len; i++) {
      var props = arguments[i];
      _.extend(this.prototype, props);
    }
  };

  /**
   * Subclasses `Resource` into a new class.
   */

  Resource.extend = require('./lib/extend')(_);

  function camelize (str) {
    return str.trim().replace(/[-_\s]+(.)?/g, function (match, c) { return c.toUpperCase(); });
  }

  function underscored (str) {
    return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[\.-\s]+/g, '_').toLowerCase();
  }

  _.extend(Resource.prototype, Ostruct.events);
  Ostruct.object = Resource;

  return Ostruct;

}));
