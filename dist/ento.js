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

  var coerce = ((function(){var module={exports:{}},exports=module.exports;(function(){/**
 * coerce : coerce(value, type)
 * (internal) coerces a `value` into a type `type`.
 *
 *     coerce("200", Number);   => 200
 *     coerce(200, String);     => "200"
 *     coerce("yes", Boolean);  => true
 */

module.exports = function (value, type) {
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
};
})();return module.exports;})());
  var stringUtils = ((function(){var module={exports:{}},exports=module.exports;(function(){exports.camelize = function (str) {
  return str.trim().replace(/[-_\s]+(.)?/g, function (match, c) { return c.toUpperCase(); });
};

exports.underscored = function (str) {
  return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[\.-\s]+/g, '_').toLowerCase();
};
})();return module.exports;})());
  var camelize = stringUtils.camelize;
  var underscored = stringUtils.underscored;

  /*
   * etc
   */

  Ento.events = ((function(){var module={exports:{}},exports=module.exports;(function(){var slice = [].slice;

module.exports = function (_) {
  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      var args = slice.call(arguments, 1);
      return this.triggerFor(this, name, args);
    },

    triggerFor: function(ctx, name, args) {
      if (!this._events) return this;
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, ctx, args);
      if (allEvents) triggerEvents(allEvents, ctx, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, ctx, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx||ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx||ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx||ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx||ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx||ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  return Events;
};
})();return module.exports;})())(_);
  Ento.persistence = ((function(){var module={exports:{}},exports=module.exports;(function(){module.exports = function (_) {
  return function (model) {
    model
      .on('init', function () {
        this.is.loading = false;
      })
      .use({
        fetch: function (fn) {
          if (!this.api || !this.api.sync)
            throw new Error("fetch(): no api.sync");

          var sync = this.api.sync;
          var self = this;

          status(self, { fetching: true, error: false });
          self.trigger('fetching');

          sync('get', self, function (err, res) {
            if (err) {
              status(self, { fetching: false, error: err });
              self.trigger('error');
              if (fn) fn(err);
            } else {
              status(self, { fetching: false, loaded: true, error: false });
              self.set(res);
              self.trigger('load');
              if (fn) fn(err, res);
            }
          });
        },

        save: function () {
          // todo
        },

        destroy: function () {
          // todo
        }
      });

    function status(obj, state) {
      _.extend(obj.is, state);
      obj.trigger('change:is', obj.is);
    }
  };
};
})();return module.exports;})())(_);
  Ento.exportable = ((function(){var module={exports:{}},exports=module.exports;(function(){module.exports = {

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

})();return module.exports;})());
  Ento.relations = ((function(){var module={exports:{}},exports=module.exports;(function(){/***
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
})();return module.exports;})())(_, camelize);

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
    name = camelize(name);
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

  Objekt.extend = ((function(){var module={exports:{}},exports=module.exports;(function(){module.exports = function (_) {
  return function (protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static attributes to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype attributes (instance attributes) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    if (typeof child.extended === 'function')
      child.extended();

    return child;
  };
};
})();return module.exports;})())(_);

  Objekt.use(Ento.events);

  /**
   * api : api()
   * sets or gets the api object.
   *
   *   var db = {
   *     sync: function(){ ... }
   *   };
   *
   *   Model = Ento()
   *     .api(db);
   */

  Objekt.api = function (value) {
    if (!arguments.length) return this.prototype.api;
    this.prototype.api = value;
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
    Object.defineProperty(instance, 'raw', { value: {}, enumerable: false });

    /** is: states */
    Object.defineProperty(instance, 'is', { value: {}, enumerable: false });

    /** api: Root instance */
    if (api) instance.api = api;

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
      var self = this;

      // set raw; use the setter
      this.is.fresh = false;
      var prop = this.constructor.attributes[key];

      if (prop && prop.set) prop.set.call(this, value);
      else this[key] = value;

      if (!options || !options.silent) {
        var keys = _.uniq([key, camelize(key), underscored(key)]);
        _.each(keys, function (key) {
          self.trigger('change:'+key, value);
        });

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
    },

    /**
     * toJSON:
     * exports as a JSON-like object for serialization
     */

    toJSON: function () {
      var object = {};
      var self = this;

      // catch all enumerable properties
      _.each(this, function (value, key) {
        object[key] = value;
      });

      // catch dynamic attributes
      var attrs = this.constructor.attributes;
      _.each(attrs, function (definition, attr) {
        if (definition.json === false) return;
        object[attr] = self[attr];
      });

      return object;
    }
  });

  return Ento;

}));

