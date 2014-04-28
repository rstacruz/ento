# ento.js

Yet another model library. WIP.

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

"[Ento](https://en.wiktionary.org/wiki/Special:Search?search=ento&go=Look+up)" 
is the Esperanto transation of the word "entity."

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

### Defining attributes

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

### Methods

*use()* adds to the prototype.

```js
var Person = Ento()
  .use({
    greet: function() {
      alert("Hi, " + this.name);
    }
  });

var me = new User({ name: "Miles Davis" });
me.greet();
```

### Simple attributes

No fancy syntax here.

```js
var Book = Ento()
  .attr('genre');

book.genre = 'fiction';
book.genre; //=> 'fiction'
```

### Dynamic attrs

```js
var User = Ento()
  .attr('fullName', function () {
      return this.firstName + ' ' + this.lastName;
  });

var me = new User({ firstName: 'John', lastName: 'Coltrane' });
me.fullName == 'John Coltrane';
```

### Underscore and camelcase normalization

Both camelcase and underscores are available for attributes. This reconciles a 
common problem of having the backend (eg, Rails) have underscored conventions, 
       while .js files tend to have camelCase conventions.

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

### Method set

```js
book.set('genre', 'fiction');
book.set({ genre: 'fiction' });
```

### States

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

### Collections (not yet)

```js
Books = Ento.list()
books = new Books([ {...}, {...} ])
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
