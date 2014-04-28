/*
 * Simple distribution builder.
 *
 * Replaces require('...') in stdin with the files. This makes it easy to
 * create distributions for frontend packages.
 *
 * example:
 *
 *     // index.js
 *     alert(require('./foo'));
 *
 *     // foo.js
 *     module.exports = "Hello";
 *
 * and you can run:
 *
 *     bake < index.js
 *
 * which yields something to the effect of:
 *
 *     alert((function(){
 *      var module={exports:{}},exports=module.exports;
 *      (function(){ module.exports = "Hello"; })();
 *      return module.exports;
 *     })());
 *
 * Which is functionally-equivalent to:
 *
 *     alert("Hello");
 */
var fs = require('fs');

var tpl =
  "((function(){"+
    "var module={exports:{}},exports=module.exports;"+
    "(function(){...})();"+
    "return module.exports;"+
  "})())";

readStdin(function (e, data) {
  console.log(bake(data, './'));
});

function bake(data, prefix) {
  data = data.replace(/require\(['"](\..*?)['"]\)/g, function (e, fn) {
    var contents = fs.readFileSync(prefix + fn + '.js', 'utf-8');
    return tpl.replace('...', contents);
  });
  return data;
}

function readStdin(fn) {
  process.stdin.resume(); /* paused by default */
  process.stdin.setEncoding('utf8');

  var data = '';
  process.stdin.on('data', function(chunk) { data += chunk.toString(); });
  process.stdin.on('end', function() { fn(null, data); });
}
