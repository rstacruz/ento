/*
 * Dependency mapping.
 *
 *   var deps = new Depmap();
 *   deps.add('fullname', ['firstname', 'lastname']); // adds item and dependencies
 *   deps.dependents('firstname'); #=> fullname
 *   deps.dependencies('fullname'); #=> firstname, lastname
 */

var Depmap = module.exports = function () {
  this.ltr = {};
  this.rtl = {};
};

Depmap.prototype = {
  add: function (left, right) {
    var ltr = this.ltr, rtl = this.rtl;
    if (!ltr[left]) ltr[left] = {};

    each(right, function (right) {
      if (!rtl[right]) rtl[right] = {};
      ltr[left][right] = true;
      rtl[right][left] = true;
    });
  },

  dependencies: function (items) {
    return this.traverse(this.ltr, items);
  },

  dependents: function (items) {
    return this.traverse(this.rtl, items);
  },

  traverse: function (mapping, items) {
    if (typeof items === 'string') items = [items];

    var obj = {}, self = this;
    each(items, function (item) {
      obj[item] = true;
      self.traverseKeys(obj, mapping, item);
    });

    return Object.keys(obj);
  },

  traverseKeys: function (re, mapping, item) {
    var self = this;

    each(mapping[item], function (val, key) {
      re[key] = self.traverseKeys(re, mapping, key);
    });

    return re;
  }
};

function each (list, fn) {
  if (list)
    for (var key in list)
      if (list.hasOwnProperty(key)) fn(list[key], key);
}
