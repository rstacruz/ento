sources = index.js $(wildcard lib/*.js)

dist: dist/ento.js dist/ento.min.js verify stats

dist/ento.js: $(sources)
	node ./lib/bake.js < $< > $@

dist/%.min.js: dist/%.js
	uglifyjs -m < $^ > $@

verify: dist/ento.js
	@env distfile="$<" mocha -R progress

stats:
	@echo "  loc:   " `cat dist/ento.js | wc -l`
	@echo "  min:   " `cat dist/ento.min.js | wc -c` b
	@echo "  min.gz:" `cat dist/ento.min.js | gzip | wc -c` b

.PHONY: verify stats
