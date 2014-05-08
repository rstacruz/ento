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

  traverse: function (mapping, item) {
    var obj = mapping[item];
    if (!obj) return [];

    var keys = Object.keys(obj);
    return keys;
  }
};

function each(list, fn) {
  for (var key in list) {
    if (list.hasOwnProperty(key)) fn(list[key], key);
  }
}
