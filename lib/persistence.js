module.exports = function (Ento) {
  var _ = Ento._;

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
