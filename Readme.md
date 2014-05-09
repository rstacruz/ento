# ento.js

Simple, stateful, observable objects in JavaScript. Yet another model library, 
  but this one aims to make the API experience as close to *plain JavaScript 
  objects* as possible.

Work-in-progress.

- __Plain attributes__:
No need for methods to get/set values (ie, *.get()* and *.set()*).  ECMAScript 
getters and setters are used to listen for behavior on setting/getting 
attributes.

- __Model states__:
Keeps track of your model's state if it's fetching, or got an error. This is 
useful when used with data-binding view libraries.

- __Custom sync__:
No persistence is built in. No AJAX, no SQL, no nothing. It makes no assumptions 
on how you want to sync your data, and allows you to implement it however you 
need it.

- __Browser or Node.js__:
Reuse the same business code in your client-side libs and your server-side libs.

"[Ento](https://en.wiktionary.org/wiki/Special:Search?search=ento&go=Look+up)" 
is the Esperanto transation of the word "entity."

[![Status](https://travis-ci.org/rstacruz/ento.svg?branch=master)](https://travis-ci.org/rstacruz/ento)

## API overview

See [documentation](Documentation.md).

```js
var Name = Ento()
  .attr('first')
  .attr('last');

me = new Name({ first: 'John', last: 'Coltrane' });

me.first = 'Jacques';
```

Complicated example:

```js
var Person = Ento()
  .attr('id', Number)
  .attr('first_name')
  .attr('last_name')
  .attr('full_name', ['first_name', 'last_name'], function () {
    return [this.first_name, this.last_name].join(' ');
  }) // computed properties
  .use(Ento.persistence) // plugins
  .use(Ento.validation)
  .use({
    introduce: function() {
      alert("Hi, I'm " + this.fullName);
    },
    dance: function() {
      alert("Whoa!");
    }
  });

var me = new User({ firstName: "Miles", lastName: "Davis" });
me.introduce();
me.dance();
```

## What's it like?

 * It's like [Ember].Object, except decoupled from any MVC library.
 * It's like [Backbone].Model, but less emphasis on collections.
 * It's like [Spine].Model, but with change tracking.
 * It's like [Modella], but with collections. (You should probably try Modella, 
     actually.)
 * It's like all of the above, with simpler syntax, and a use-only-what-you-need
 approach.

### Feature comparison

| Feature                | Ento    | Ember    | Backbone | Spine | Modella |
|------------------------|---------|----------|----------|-------|---------|
| Persistence            | ✓       | ✓        | ✓        | ✓     | ✓       |
| Events                 | ✓       | ✓        | ✓        | ✓     | ✓       |
| Validations            | ✓       | ✓        | ✓        | ✓     | ✓       |
| Change tracking        | [✓][ct] | [✓][eob] | ✓        |       | ✓       |
| Collections            | ✓       | ✓        | [✓][bcl] | ✓     |         |
| Setters                | ✓       | ✓        |          |       | ✓       |
| Computed properties    | [✓][cp] | [✓][ecp] |          |       |         |
| Simple property syntax | ✓       |          |          |       |         |
| Case normalization     | [✓][cn] |          |          |       |         |
| Unknown properties     |         | [✓][eup] |          |       |         |

[eup]: http://jfire.io/blog/2012/04/19/why-ember-dot-js-doesnt-use-property-descriptors/
[eob]: http://emberjs.com/guides/object-model/observers/
[ecp]: http://emberjs.com/guides/object-model/computed-properties/
[bcl]: http://backbonejs.org/#Collection
[cn]: #underscore-and-camelcase-normalization
[ct]: #change-tracking
[cp]: #computed-properties

## Acknowledgements

Contains code from Backbone.js.

> Backbone's MIT license goes here

[Modella]: https://github.com/modella/modella
[Ember]: http://emberjs.org
[Backbone]: http://backbonejs.org
[Spine]: http://spinejs.com
