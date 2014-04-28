/*
 * simple distribution builder.
 * replaces require('...') in stdin with the files.
 */
var fs = require('fs');

var tpl =
  "((function(){"+
    "var module={exports:{}};"+
    "(function(){...})();"+
    "return module.exports;"+
  "})())";

readStdin(function (e, data) {
  console.log(bake(data));
});

function bake(data) {
  data = data.replace(/require\(['"](\..*?)['"]\)/g, function (e, fn) {
    var contents = fs.readFileSync(fn + '.js', 'utf-8');
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
