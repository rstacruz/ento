sources = index.js $(wildcard lib/*.js)

dist: dist/ostruct.js dist/ostruct.min.js verify

dist/ostruct.js: $(sources)
	node ./lib/bake.js < $< > $@

dist/%.min.js: dist/%.js
	uglifyjs -m < $^ > $@

verify: dist/ostruct.js
	env distfile="$<" mocha -R progress

.PHONY: verify
