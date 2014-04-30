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
        if (vars) {
          ignore = true;
          ractive.set(prefixer(vars));
        } else {
          ractive.update(keypath);
        }
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

        // Propagate from DOM to object. (to do)
        set: function (key, val) {
          if (ignore) { ignore = false; return; }
          object.set(key, val);
        },

        // Don't mind this right now
        reset: function (data) {
          return false;
        }

      };
    }
  };
};
