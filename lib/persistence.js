module.exports = {
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

    // Clear out each of the attributes
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
