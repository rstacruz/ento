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
      events.push({callback: callback, context: context, ctx: context || this});
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
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
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
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
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
  Ento.persistence = ((function(){var module={exports:{}},exports=module.exports;(function(){module.exports = {
  /** itemClass: the class of each item */
  itemClass: null,

  /**
   * Exports.
   *
   * If you're subclassing this, you have to include these defaults in the subclass as well.
   */

  exports: ['state', 'error', 'fresh', 'items'],

  /**
   * Fetch data.
   *
   *     trips = Tripid.trips();
   *     trips.fetch(function () { ... });
   */

  fetch: function (fn) {
    var resource = this;

    resource._setFetching();
    this.api.sync(this, 'get', function (err, data) {
      if (err) {
        resource._setError(err);
        if (fn) fn(err);
      } else {
        resource._setData(data);
        if (fn) fn(null, resource);
      }
    });

    return this;
  },

  /**
   * Just like fetch, but clears first
   */
  refetch: function (fn) {
    this.reset();
    return this.fetch(fn);
  },

  /**
   * (Internal) Marks the resource as `fetching`.
   */

  _setFetching: function () {
    this.fresh = false;
    this.state = 'fetching';
    this.error = false;
    this.trigger('change');
  },

  /**
   * (Internal) Sets the object's state to `error`.
   */

  _setError: function (err) {
    this.fresh = false;
    this.state = 'error';
    this.error = {
      status: err.status,
      message: err.message
    };
    this.trigger('change');
    this.trigger('error', err);
  },

  /**
   * (Internal) Done after a successful fetch.
   */

  _setData: function (data) {
    this.fresh = false;
    this.state = 'data';

    if (Array.isArray(data)) {
      var itemClass = this.itemClass;
      if (itemClass)
        this.items = _.map(data, function (item) { return new itemClass(this, item); });
      else
        this.items = data;
    } else {
      this.set(data);
    }

    this.trigger('change');
    this.trigger('data');
  },

  /**
   * Removes data and returns it to the fresh state.
   * TODO: test
   */

  reset: function () {
    var res = this;
    res.fresh = true;

    // Clear out each of the properties
    // TODO: Make generic support props
    if (res.props)
      res.props.forEach(function (key) {
        if (res.hasOwnProperty(key) && typeof res[key] !== 'function') {
          delete res[key];
        }
      });

    // Clear out the array stuff
    if (res.items) res.items = [];

    res.trigger('change');
  }
};
})();return module.exports;})());
  Ento.exportable = ((function(){var module={exports:{}},exports=module.exports;(function(){module.exports = {

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

})();return module.exports;})());

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
   */

  Objekt.attr = function (name) {
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
        this.is.fresh = false;
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

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
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
  });

  return Ento;

}));

