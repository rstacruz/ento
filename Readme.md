# resource.js

ORM.

 * Works on Node.js and on the browser.
 * No persistence - implement it yourself.
 * Simplest possible API.

### Why?

- __Simple attributes__:
No need for methods to get/set values (ie, *.get()* and *.set()*).  ECMAScript 
getters and setters are used. (unlike Backbone.Model)

- __Model states__:
Keeps track of your model's state if it's fetching, got an error, etc -- this 
makes it suitable for using in data-binding view libraries.

- __Custom sync__:
No AJAX, no whatever - no assumptions on how you want to sync your data.  
(unlike most others)

## Simple API

### Making a class and instanciation

Running *resource()* makes a new class.

```js
var Album = resource();
```

### Instanciate

```js
var album = new Album({
  title: "Splenenie",
  artist: "Maciej Tubis",
  year: 2011
});

console.log(album.year);
```

### Methods

```js
var Person = resource()
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

```js
var Person = resource()
  .prop('firstName')
  .prop('lastName')
  .prop('age', Number)
  .prop('birthday', Date)
  .prop('fullName', function () { return /*...*/; })
  .use(resource.validations)
  .use({
    // instance methods here
  });
```

### Dynamic attrs

```js
var User = resource()
  .prop('fullName', {
    get: function () {
      return this.firstName + ' ' + this.lastName;
    }
  });

var me = new User({ firstName: 'John', lastName: 'Coltrane' });
me.fullName == 'John Coltrane';
```

### Simple setters and getters

```js
var Book = resource()
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
Books = resource.list()
books = new Books([ {...}, {...} ])
books.items
books.each(...)
```

### CoffeeScript support

```coffee
class Book extends resource.object
  @attr 'title'
  @attr 'genre'

  burn: ->
    ...
