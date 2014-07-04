# ento.js

Simple, stateful, observable objects in JavaScript. Yet another model library, 
  but this one aims to make the API experience as close to *plain JavaScript 
  objects* as possible.

```js
var User = Ento()
  .attr('id', Number)
  .attr('firstName')
  .attr('lastName');

me = new User({ firstName: 'John', lastName: 'Coltrane' });

me.firstName = 'Jacques';
me.first_name;

m.on('change', function (attrs) { ... });
```

- __Plain attributes__:
ECMAScript getters and setters are used to listen for updates in attributes.
No need for methods like *.get()* and *.set()*.

- __Change tracking__:
Listen for changes in instances via `.on('change')`.

- __Custom sync__:
No persistence is built in (AJAX, SQL, etc). Implement it however you need it.

- __Model states__:
Keeps track of your model's state if it's fetching, or got an error. This is 
useful when used with data-binding view libraries.

- __Browser or Node.js__:
Reuse the same business code in your client-side libs and your server-side libs.

"[Ento](https://en.wiktionary.org/wiki/Special:Search?search=ento&go=Look+up)" 
is the Esperanto transation of the word "entity."

[![Status](https://travis-ci.org/rstacruz/ento.svg?branch=master)](https://travis-ci.org/rstacruz/ento)

## Get it

Ento depends on [underscore.js], and is available via Bower and NPM.

See [documentation] for better instructions.

## API overview

__Computed properties:__ you can define properties that are derived from other 
properties.

```js
var Person = Ento()
  .attr('firstName')
  .attr('lastName')
  .attr('fullName', ['firstName', 'lastName'], function () {
    return [this.firstName, this.lastName].join(' ');
  });

var me = new User({ firstName: "Miles", lastName: "Davis" });

me.fullName;
=> "Miles Davis"
```

__Plugins, and instance methods:__ create methods via `use()`.

```js
var Car = Ento()
  .use(Ento.persistence) // plugins
  .use(Ento.validation)
  .use({
    start: function () { ... },
    drive: function () { ... }
  });

var civic = new Car();
civic.start();
```

See the [documentation] for even more features.

## What's it like?

 * It's like [Ember].Object, except decoupled from any MVC library.
 * It's like [Backbone].Model, but less emphasis on collections.
 * It's like [Spine].Model, but with change tracking.
 * It's like [Modella], but with collections. (You should probably try Modella, 
     actually.)
 * It's like all of the above, with simpler syntax, and a use-only-what-you-need
 approach.

## Acknowledgements

Contains code from Backbone.js.

> Backbone's MIT license goes here

[Modella]: https://github.com/modella/modella
[Ember]: http://emberjs.org
[Backbone]: http://backbonejs.org
[Spine]: http://spinejs.com
[underscore.js]: http://underscorejs.org
[documentation]: Documentation.md

Thanks
------

**Ento** © 2014+, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT License]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/ento/contributors

