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

## What's it like?

 * It's like [Ember].Object, except decoupled from any MVC library.
 * It's like [Backbone].Model, but less emphasis on collections.
 * It's like [Spine].Model, but with change tracking.
 * It's like [Modella], but with collections. (You should probably try Modella, 
     actually.)
 * It's like all of the above, with simpler syntax.

## API

API is made to be as simple as possible.

### Basic usage

Running *Ento()* makes a new class, which you can instanciate.

```js
var Ento = require('ento');

// create a class
var Album = Ento();

// and instanciate it
var album = new Album({
  title: "Splenenie",
  artist: "Maciej Tubis",
  year: 2011
});

console.log(album.year);
```

### Attributes

Use *attr()* to define properties. This will enable features on those properties 
such as change tracking, type coercion, and more.

```js
var Person = Ento()
  .attr('id', Number)
  .attr('firstName')
  .attr('lastName')
  .attr('address', String)
  .attr('birthday', Date)
  .attr('fullName', function () { return /*...*/; })
  .use(Ento.exportable)
  .use({
    // instance methods here
  });

var me = new Person({ firstName: "Frank", lastName: "Sinatra" });
me.birthday = "1915-12-02T12:00:00Z";
```

Use attributes just like you would without Ento. No fancy syntax here.

```js
var Book = Ento()
  .attr('genre');

book = new Book();
book.genre = 'fiction';
book.genre; //=> 'fiction'
```

Non-explicit attributes also work, but they will not be tracked for changes.

```js
Book = Ento();
book = new Book();

book.isbn = "00123";
```

### Methods

*use()* adds to the prototype.

```js
var Person = Ento()
  .use({
    introduce: function() {
      alert("Hi, I'm " + this.name);
    }
    dance: function() {
      alert("Whoa!");
    }
  });

var me = new User({ name: "Miles Davis" });
me.introduce();
me.dance();
```

### Computed attributes

```js
var Name = Ento()
  .attr('fullname', function () {
      return [this.first, this.last].join(' ');
  });

var me = new Name({
  first: 'John',
  last: 'Coltrane'
});

me.fullname; // => 'John Coltrane';
```

### Underscore and camelcase normalization

Both camelcase and underscores are available for attributes. This reconciles a 
common problem of having the backend (eg, Rails) have *underscored* conventions, 
       while .js files tend to have *camelCase* conventions.

```js
var User = Ento()
  .attr('firstName')
  .attr('lastName');

var me = new User({
  firstName: 'Dexter',
  last_name: 'Morgan'
});

me.first_name = "Dexter";

me.first_name; //=> "Dexter"
me.firstName;  //=> "Dexter"
```

### Change tracking

Know when attributes change.

```js
var User = Ento()
  .attr('firstName')
  .attr('lastName');

var me = new User();

// when `firstName` changes
me.on('change:firstName', function() { ... });

// when anything changes
me.on('change', function() { ... });

// triggers the two events above
me.firstName = "Jacques";
```

### Method set

Also works.

```js
book.set('genre', 'fiction');
book.set({ genre: 'fiction' });
```

### States (to be implemented)

```js
book.is.fresh    // hasn't been modified since instanciation
book.is.new      // has an ID
book.is.busy     // is fetching/saving/deleting
book.is.fetching // is currently fetching
book.is.loaded   // has been fetched
book.is.saving   // is currently saving
book.is.deleting // is currently being deleted
book.is.deleted  // has been deleted
book.is.error    // persistence errors
```

### Collections (to be implemented)

```js
Books = Ento()
  .use(Ento.collection);

books = new Books();
books.set([ {...}, {...} ]);
books.items
books.each(...)
```

### CoffeeScript support

```coffee
class Book extends Ento.object
  @attr 'title'
  @attr 'genre'

  burn: ->
    ...
```

## Acknowledgements

Contains code from Backbone.js.

> Backbone's MIT license goes here

[Modella]: https://github.com/modella/modella
[Ember]: http://emberjs.org
[Backbone]: http://backbonejs.org
[Spine]: http://spinejs.com
