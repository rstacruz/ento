(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory); /* AMD */
  } else if (typeof exports === 'object') {
    module.exports = factory(underscore()); /* CommonJS */
  } else {
    root.Ento = factory(underscore()); /* Globals */
  }

  function underscore() {
    try { return require('underscore'); }
    catch (e) { return root._; }
  }

}(this, function (_) {

  if (!_) throw new Error("Ento: underscore.js not found.");

  var Objekt;

  /*
   * Ento
   */

  function Ento() {
    return Objekt.extend();
  }

  /*
   * utilities
   */

  var coerce = require('./lib/coerce');
  var stringUtils = require('./lib/strings');
  var camelize = stringUtils.camelize;
  var underscored = stringUtils.underscored;

  /*
   * etc
   */

  Ento.events = require('./lib/events')(_);
  Ento.persistence = require('./lib/persistence');
  Ento.exportable = require('./lib/exportable');

  /*
   * object
   */

  Ento.object = Objekt = function () {
    var api, options;

    // determine the params (api, options)
    for (var i=0, len=arguments.length; i<len; i++) {
      if (i === 0 && arguments[0] && arguments[0].sync) {
        api = arguments[0];
      } else if (typeof arguments[i] === 'object' && !options) {
        options = arguments[i];
      }
    }

    /** states */
    this.is = {};

    /** Root instance */
    this.api = api;

    /** raw data */
    this.raw = {};

    if (options) this.set(options);
    this.is.fresh = true;

    this.init(options);
  };

  /***
   * Working with objects:
   * so and so
   */

  Objekt.extended = function () {
    /**
     * properties : Array
     * List of properties.
     */

    this.properties = {};
  };

  Objekt.extended();

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
   *
   * Possible options:
   *
   * ~ get: getter function
   * ~ set: setter function
   * ~ type: type to coerce to. can be String | Boolean | Date | Number
   * ~ enumerable: shows up in keys. (default: true)
   * ~ exportable: will it show up on export()? (default: true)
   */

  Objekt.attr = function (name) {
    // parse arguments into options
    var options = {};
    for (var i=1, len=arguments.length; i<len; i++) {
      var arg = arguments[i];
      if (typeof arg === 'object') {
        _.extend(options, arg);
      } else if (~[Number, String, Date, Boolean].indexOf(arg)) {
        options.type = arg;
      } else if (typeof arg === 'function') {
        if (!options.get) options.get = arg;
        else if (!options.set) options.set = arg;
      }
    }

    if (typeof options.enumerable === 'undefined')
      options.enumerable = true;

    if (!options.get && options.type)
      options.get = function () { return coerce(this.raw[name], options.type); };

    if (!options.get)
      options.get = function () { return this.raw[name]; };

    if (!options.set)
      options.set = function (value) { this.raw[name] = value; };

    // save options
    this.properties[name] = options;

    var names = _.uniq([ name, camelize(name), underscored(name) ]);
    for (var i=0, len=names.length; i<len; i++) {
      Object.defineProperty(this.prototype, names[i], {
        enumerable: options.enumerable,
        get: options.get,
        set: function (value) { this.set(name, value); }
      });
    }

    return this;
  };

  /**
   * propertyNames:
   * returns property names.
   *
   *     Name = ento()
   *       .attr('first')
   *       .attr('last');
   *
   *    Name.propertyNames();
   *    => ['first', 'last']
   */

  Objekt.propertyNames = function () {
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
   *     var Person = ento()
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
   *     var Record = ento().use(Timestamps);
   */

  Objekt.use = function (props, staticProps) {
    if (!props && arguments.length === 1) {
      throw new Error("ento.use: invalid arguments");
    }
    else if (typeof props === 'function') {
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
   * Subclasses `Objekt` into a new class.
   */

  Objekt.extend = require('./lib/extend')(_);

  Objekt.use(Ento.events);

  /***
   * Working with instances:
   * Here's how to work with instances.
   */

  Objekt.use({

    /**
     * init:
     * Sorta constructor. Override this.
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
      this.is.fresh = false;
      var prop = this.constructor.properties[key];
      if (prop && prop.set) prop.set.call(this, value);
      else this[key] = value;
      this.trigger('change:'+key, value);
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
  });

  return Ento;

}));
