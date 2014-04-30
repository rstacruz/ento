module.exports = function (_) {
  return function (model) {
    /**
     * hasOne:
     * creates a relation
     */
 
    model.hasOne = function (attr, klass) {
      return this
        .attr(attr, {
          set: function (value) {
            if (!value)
              this.raw[attr] = undefined;

            else if (typeof value !== 'object')
              throw new Error("hasOne(): not an object");

            else
              this.raw[attr] = new klass(value);
          }
        });
    };

    model.belongsTo = function (attr, klass) {
      return this;
    };


  };
};
