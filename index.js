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

    this.constructor.trigger('init', this);
    this.init(options);
  };

  /***
   * Working with objects:
   * so and so
   */

  Objekt.extended = function () {
    /**
     * attributes : Array
     * List of attributes.
     */

    this.attributes = {};
  };

  Objekt.extended();

  _.extend(Objekt, Ento.events);

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
    var options = attrOptions.apply(this, arguments);

    // save options into `Object.attributes`
    this.attributes[name] = options;

    // defineProperty as needed, on both camel and underscore
    var names = _.uniq([ name, camelize(name), underscored(name) ]);
    var setter = function (value) { this.setOne(name, value); };
    for (var i=0, len=names.length; i<len; i++) {
      Object.defineProperty(this.prototype, names[i], {
        enumerable: options.enumerable,
        get: options.get,
        set: setter
      });
    }

    return this;
  };

  /*
   * attrOptions:
   * (internal) parses arguments passed onto `.attr` to create an options hash,
   * filling in defaults as needed.
   *
   *      {
   *        get: function() { ... }, // *
   *        set: function() { ... }, // *
   *        enumerable: true, // *
   *        type: String,
   *      },
   *      // * - always there, even if not explicitly passed to .attr.
   */

  function attrOptions(name) {
    var options = {};
    options.name = name;

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

    return options;
  }

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
    return _.keys(this.attributes);
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
     *
     *     .set({ title: 'House of Holes' });
     *     .set('title', 'House of Holes');
     */

    set: function (key, value, options) {
      // handle objects (.set({...}))
      if (typeof key === 'object')
        return this.setMany(key, value);
      else
        return this.setOne(key, value, options);
    },

    /**
     * setMany:
     * (internal) handles *.set({...})*.
     */

    setMany: function (attrs, options) {
      // ensure that the individual .setOne() does not trigger a
      // `change` event, only a `change:attr` event.
      if (!options) options = {};
      options.nochange = true;

      // use .setOne
      for (var k in attrs)
        if (attrs.hasOwnProperty(k))
          this.setOne(k, attrs[k], options);

      if (!options || !options.silent)
        this.trigger('change', attrs);
    },

    /**
     * setOne:
     * (internal) handles *.set(key, val)*.
     */

    setOne: function (key, value, options) {
      // set raw; use the setter
      this.is.fresh = false;
      var prop = this.constructor.attributes[key];

      if (prop && prop.set) prop.set.call(this, value);
      else this[key] = value;

      if (!options || !options.silent) {
        this.trigger('change:'+key, value);

        if (!options || !options.nochange) {
          var changes = {};
          changes[key] = value;
          this.trigger('change', changes);
        }
      }
    },

    /**
     * get : get(attr)
     * return the value of the given attribute *attr*. This is the
     * same as using the getter, except it can do reserved keywords as
     * well.
     */

    get: function (attr) {
      var prop = this.constructor.attributes[attr];

      if (prop)
        return prop.get.apply(this);
      else
        return this[attr];
    },

    /**
     * trigger : trigger(event)
     * triggers ar event `event`. Also triggers the event in the
     * constructor.
     */

    trigger: function (event) {
      var staticArgs = [ this ].concat(arguments);
      Ento.events.trigger.apply(this, arguments);
      Ento.events.trigger.apply(this.constructor, staticArgs);
      return this;
    }
  });

  return Ento;

}));
