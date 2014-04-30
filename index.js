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

  /***
   * Ento:
   * Creates a model subclass.
   *
   *     var Model = Ento();
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

  /***
   * Object:
   */

  Ento.object = Objekt = function (options) {
    // giving `false` means the .build() step should be bypassed.
    // this is an internal convention used by .build().
    if (options !== false)
      return this.constructor.build.apply(this, arguments);
  };

  Objekt.extended = function () {

    /**
     * attributes : Object
     * List of attributes registered with [attr()].
     *
     *   Page = Eton.extend()
     *     .attr('title')
     *     .attr('slug');
     *
     *   Page.attributes.title
     *   => { name: 'title', get: [Function], set: [Function], ... }
     *
     *   Page.attributes.slug
     *   => { name: 'slug', get: [Function], set: [Function], ... }
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
   *   attr('name')
   *   attr('name', function())
   *   attr('name', function(), function())
   *   attr('name', String|Boolean|Date|Number)
   *   attr('name', { options })
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

    // defineProperty as needed, on both camel and underscore.
    // skip anything that already exists in the prototype.
    var names = _.uniq([ name, camelize(name), underscored(name) ]);
    var setter = function (value) { this.setOne(name, value); };
    for (var i=0, len=names.length; i<len; i++) {
      if (this.prototype[names[i]]) continue;
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
   *   {
   *     get: function() { ... }, // *
   *     set: function() { ... }, // *
   *     enumerable: true, // *
   *     type: String,
   *   },
   *   // * - always there, even if not explicitly passed to .attr.
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
   * attributeNames:
   * returns property names.
   *
   *   Name = ento()
   *     .attr('first')
   *     .attr('last');
   *
   *   Name.attributeNames();
   *   => ['first', 'last']
   */

  Objekt.attributeNames = function () {
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
   *   var Person = ento()
   *     .attr('name')
   *     .use({
   *       greet: function() {
   *         alert("Hello, " + this.name);
   *       }
   *     })
   *
   * Or as a function:
   *
   *   var Timestamps = function (model) {
   *     model
   *       .attr('createdAt')
   *       .attr('updatedAt');
   *   }
   *
   *   var Record = ento().use(Timestamps);
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
   * extend : extend([props])
   * Subclasses [ento.object] into a new class. This creates a new
   * subclass that inherits all of the parent class's methods,
   * attributes and event listeners.
   *
   *   var Shape = Ento();
   *   var Circle = Shape.extend();
   *
   * A more detailed example: using *.extend()* in a model with
   * attributes creates a new model with the same attributes, allowing
   * you to build on top of another model.
   *
   *   var Address = Ento()
   *     .attr('street')
   *     .attr('city')
   *     .attr('zip');
   *
   *    var ApartmentAddress = Address.extend()
   *      .attr('unit')
   *      .attr('apartment');
   *
   * You may also pass an object to *.extend()*. This will use those
   * objects as properties, like Backbone. This is functionally
   * equivalent to *.extend().use({...})*.
   *
   *   var User = Ento();
   *   var Admin = User.extend({
   *     lol: function() { ... }
   *   });
   */

  Objekt.extend = require('./lib/extend')(_);

  Objekt.use(Ento.events);

  /**
   * api : api()
   * sets or gets the api object
   */

  Objekt.api = function (value) {
    if (!arguments.length) return this._api;
    this._api = value;
    return this;
  };

  /**
   * build : build([props])
   * constructor. Calling *Model.build()* is functionally-equivalent to
   * *new Model()*, and is provided for convenience.
   *
   *   var Album = Ento()
   *     .attr('title')
   *     .attr('year', Number);
   *
   *   var item = Album.build({
   *     title: 'Kind of Blue',
   *     year: 1984
   *    });
   */

  Objekt.build = function () {
    var api, options, instance;
    if (this instanceof Objekt)
      instance = this;
    else
      instance = new this(false);

    // determine the params (api, options)
    if (arguments.length === 2) {
      api = arguments[0];
      options = arguments[1];
    } else {
      api = instance.constructor.api();
      options = arguments[0];
    }

    /*** Instance attributes: */

    /** raw: raw data */
    instance.raw = {};

    /** is: states */
    instance.is = {};

    /** api: Root instance */
    instance.api = api;

    instance.trigger('build', instance);
    if (options) instance.set(options);
    instance.is.fresh = true;

    instance.trigger('init', instance);
    instance.init(options);
    return instance;
  };

  /***
   * Object events:
   *
   * ~ build: triggered when building
   * ~ init: when initializing
   * ~ change: when properties are changed
   * ~ change:attr: when a given attribute is changed
   */

  /***
   * Object instances:
   */

  Objekt.use({

    /**
     * init:
     * The constructor. Override this.
     *
     *     Model = Ento()
     *       .use({
     *         init: function() {
     *         })
     *       });
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
     * setMany : setMany(attrs, [options])
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
     * setOne : setOne(key, value, [options])
     * (internal) handles *.set(key, value)*.
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
     *
     *   var Document = Ento()
     *     .attr('title')
     *     .attr('author');
     *
     *   var doc = new Document();
     *
     *   doc.title = "Manual";
     *   doc.get('title')  //=> "Manual"
     *   doc.title         //=> "Manual"
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
     * triggers an event `event`. Also triggers the event in the
     * constructor.
     */

    trigger: function (event) {
      Ento.events.trigger.apply(this, arguments);
      Ento.events.triggerFor.call(this.constructor, this, event, [].slice.call(arguments, 1));
      return this;
    }
  });

  return Ento;

}));
