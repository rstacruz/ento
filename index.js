(function(root, factory) {

  module.exports = factory(require('underscore'));

  // if (typeof define === 'function' && define.amd) {
  //   define(['underscore'], factory); /* AMD */
  // } else if (typeof exports === 'object') {
  //   factory(root._); /* CommonJS */
  // } else {
  //   root.Resource = factory(root._); /* Globals */
  // }

}(this, function (_) {

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;

  /**
   * A remote resource.
   *
   * This is what's returned after a .getTrips() and such.
   *
   * State `res.state` can be:
   *
   *  * 'idle' - just started
   *  * 'fetching' - fetching data
   *  * 'error' - something went wrong
   *  * 'data' - there's data available
   *
   * Triggers the following events:
   *
   *  * 'error' - when fetching fails
   *  * 'change' - when any attributes change
   *  * 'data' - when fetching succeeds
   *
   * You also have:
   *
   *     res.fresh           // true if never fetched
   *     res.endpoint.get    // "/api/trips"
   *     res.api             // link to Tripid instance
   *     res.error           // { message: "Not allowed", status: 402 }
   *
   * To fetch:
   *
   *     res.fetch(function (err, res) {
   *     });
   *
   * Internal stuff:
   *
   *     this.api.userRequest('...')
   */

  var Resource = module.exports = function (api, options) {
    /** state: status of the resource */
    this.state = 'idle';

    /** api: Tripid instance */
    this.api = api;

    /** fresh: true if not fetched */
    this.fresh = true;

    if (this.defaults) _.extend(this, this.defaults);
    if (options) this.set(options);
    this.init(options);
  };

  Resource.prototype = {
    /**
     * Sorta constructor
     */

    init: function (options) {
    },

    endpoint: function () {
      return { get: '/api/trips' };
    },

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
     * set : set(key, value)
     * Sets a `key` to `value`. If a setter function is available, use it.
     */

    set: function (key, value) {
      if (arguments.length === 1 && typeof key === 'object') {
        for (var k in key) {
          if (key.hasOwnProperty(k)) this.set(k, key[k]);
        }
        return;
      }

      var fnName = camelize("set_"+key);
      if (this[fnName])
        return this[fnName](value);
      else
        this[key] = value;
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
            console.log("Resource#reset: removing", key);
            delete res[key];
          }
        });

      // Clear out the array stuff
      if (res.items) res.items = [];

      res.trigger('change');
    }
  };

  /**
   * Subclasses `Resource` into a new class.
   */

  Resource.extend = require('./lib/extend')(_);
  Resource.events = require('./lib/events')(_);

  _.extend(Resource.prototype, Resource.Events);

  function camelize (str) {
    return str.trim().replace(/[-_\s]+(.)?/g, function (match, c) { return c.toUpperCase(); });
  }

  function Rsrc() {
    return Resource.extend();
  }

  Rsrc.events = require('./lib/events')(_);
  Rsrc.resource = Resource;

  return Rsrc;

}));
