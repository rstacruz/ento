sources = index.js $(wildcard lib/*.js)
jsfuse = ./node_modules/.bin/jsfuse
uglifyjs = ./node_modules/.bin/uglifyjs

all: dist

dist: dist/ento.js dist/ento.min.js verify stats

dist/ento.js: $(sources)
	$(jsfuse) $< > $@

dist/%.min.js: dist/%.js
	$(uglifyjs) -m < $^ > $@

verify: dist/ento.js
	@env distfile="$<" mocha -R progress -b

stats:
	@echo "  loc:   " `cat dist/ento.js | wc -l`
	@echo "  min:   " `cat dist/ento.min.js | wc -c` b
	@echo "  min.gz:" `cat dist/ento.min.js | gzip | wc -c` b

.PHONY: verify stats
