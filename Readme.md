# ostruct.js

Yet another model library.

- __Simple attributes__:
No need for methods to get/set values (ie, *.get()* and *.set()*).  ECMAScript 
getters and setters are used.

- __Model states__:
Keeps track of your model's state if it's fetching, or got an error. This is 
useful when used with data-binding view libraries.

- __Custom sync__:
No persistence is built in. No AJAX, no SQL, no nothing. It makes no assumptions 
on how you want to sync your data, and allows you to implement it however you 
need it.

- __Browser, or Node.js__:
Reuse the same business code in your client-side libs and your server-side libs.

## API

API is made to be as simple as possible.

### Basic usage

Running *ostruct()* makes a new class, which you can instanciate.

```js
var ostruct = require('ostruct');

var Album = ostruct();

var album = new Album({
  title: "Splenenie",
  artist: "Maciej Tubis",
  year: 2011
});

console.log(album.year);
```

### Methods

*use()* adds to the prototype.

```js
var Person = ostruct()
  .use({
      greet: function() {
        alert("Hi, " + this.name);
      }
    }
  });

var me = new User({ name: "Miles Davis" });
me.greet();
```

### Making a class, full edition

Chaining, awesome.

```js
var Person = ostruct()
  .prop('firstName')
  .prop('lastName')
  .prop('age', Number)
  .prop('birthday', Date)
  .prop('fullName', function () { return /*...*/; })
  .use(ostruct.validations)
  .use({
    // instance methods here
  });
```

### Dynamic attrs

```js
var User = ostruct()
  .prop('fullName', function () {
      return this.firstName + ' ' + this.lastName;
  });

var me = new User({ firstName: 'John', lastName: 'Coltrane' });
me.fullName == 'John Coltrane';
```

### Simple setters and getters

```js
var Book = ostruct()
  .attr('genre');

book.genre = 'fiction';
book.genre; // === 'fiction'
```

### Method set

```js
book.set('genre', 'fiction');
book.set({ genre: 'fiction' });
```

### States

```js
book.is.fresh
book.is.fetching
book.is.loaded
book.is.error
```

### Collections

```js
Books = ostruct.list()
books = new Books([ {...}, {...} ])
books.items
books.each(...)
```

### CoffeeScript support

```coffee
class Book extends ostruct.object
  @attr 'title'
  @attr 'genre'

  burn: ->
    ...
