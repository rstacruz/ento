sources = index.js $(wildcard lib/*.js)

dist: dist/ento.js dist/ento.min.js verify

dist/ento.js: $(sources)
	node ./lib/bake.js < $< > $@

dist/%.min.js: dist/%.js
	uglifyjs -m < $^ > $@

verify: dist/ento.js
	env distfile="$<" mocha -R progress

.PHONY: verify
