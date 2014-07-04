Developer notes
===============

Build:

    make

Releasing:

    bump *.json *.js
    make
    git changelog
    git release 0.1.2

## Status

 - Computed properties ✓
 - Ento.persistence: serialization ✓
 - Ento.persistence: .api ✓
 - Ento.persistence: get ✓
 - change tracking
 - states (.is.fresh, etc)
 - Ento.relations: .hasOne ✓
 - Ento.relations: .belongsTo ✓
 - Ento.relations: .hasMany
 - Ento.collection - 1%
 - Ento.persistence - 40%
