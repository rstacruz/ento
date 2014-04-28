sources = index.js $(wildcard lib/*.js)

dist: dist/ostruct.js dist/ostruct.min.js

dist/ostruct.js: $(sources)
	node ./lib/bake.js < $< > $@

dist/%.min.js: dist/%.js
	uglifyjs -m < $^ > $@

