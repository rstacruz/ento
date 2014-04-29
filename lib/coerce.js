/**
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
