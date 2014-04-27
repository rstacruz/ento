# resource.js

ORM.

 * Works on Node.js and on the browser.
 * No persistence - implement it yourself.
 * Simplest possible API.

### Simple API

```js
// subclass:
var Album = resource();

// instanciate:
var x = new Album({
  title: "Splenenie",
  artist: "Maciej Tubis",
  year: 2011
});

// attributes

```

Simple setters and getters

```js
var Book = resource()
  .attr('genre');

book.genre = 'fiction';
book.genre; // === 'fiction'
```

States:

```js
book.is.fresh
book.is.fetching
book.is.loaded
book.is.error
```

Collections:

```js
Books = resource.list()

```
