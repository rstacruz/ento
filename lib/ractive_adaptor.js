module.exports = function (Ento) {
  var _ = Ento._;

  return {
    filter: function (object, keypath, ractive) {
      return object instanceof Ento.object;
    },

    wrap: function (ractive, object, keypath, prefixer) {
      var ignore;

      // On object change => update the view.
      // If vars are given, take it into account.
      object.on('change', function (vars) {
        if (vars) {
          ignore = true;
          ractive.set(prefixer(getScalars(object, vars)));
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

        // Propagate from DOM to object.
        set: function (key, val) {
          if (ignore) { ignore = false; return; }
          object.set(key, val);
        },

        // When you do .set and the keypath is identical
        reset: function (data) {
          if (typeof data !== 'object')
            throw new Error("Ento.ractiveAdaptor: not sure what to do");

          if (data instanceof Ento.object)
            return false;

          object.set(data);
        }

      };
    }
  };

  /*
   * get all things that are not Ento objects
   */

  function getScalars (object, vars) {
    var values = {};

    _.each(vars, function (key) {
      var value = object.get(key);
      if (!(value instanceof Ento.object))
        values[key] = value;
    });

    return values;
  }
};
