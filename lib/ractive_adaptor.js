module.exports = function (_) {
  return {
    filter: function (object, keypath, ractive) {
      return (object && object.on && object.off && object.set && object.get);
    },

    wrap: function (ractive, object, keypath, prefixer) {
      var ignore;

      // On object change => update the view.
      // If vars are given, take it into account.
      object.on('change', function (vars) {
        ignore = true;
        ractive.set(prefixer(object.get(vars)));
        // if (!vars) ractive.update(keypath);
      }, ractive);

      return {
        // Return all things.
        get: function () {
          return object.get();
        },

        // On deletion, remove the event handler.
        teardown: function () {
          object.off(null, null, ractive);
        },

        // Propagate from DOM to object.
        set: function (key, val) {
          if (ignore) { ignore = false; return; }
          object.set(key, val);
        },

        // When you do .set and the keypath is identical
        reset: function (data) {
          if (typeof data !== 'object')
            throw new Error("Ento.ractiveAdaptor: not sure what to do");

          if (data.constructor.ento)
            return false;

          object.set(data);
        }

      };
    }
  };
};
