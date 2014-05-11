ento.js
=======

Feature overview
----------------

### Basic usage

Running *Ento()* makes a new class, which you can instanciate. It should work 
just like you'd expect a plain object to.

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

album.genre = 'jazz';

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
  .attr('fullName', function () { return /*...*/; });

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

### Computed properties

```js
var Name = Ento()
  .attr('fullname', function () {
      return [this.first, this.last].join(' ');
  });

var me = new Name({
  first: 'John',
  last: 'Coltrane'
});

me.fullname; // => 'John Coltrane'
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

### Persistence

### Validations

### Relations

### States

When operations are done like [fetch()] or [save()], the state is saved into an 
object called `is`.

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

Change events are also triggered for this.

```js
book.on('change:is', function () {
  // status has changed, do something
});
```

### Methods

*use()* adds to the prototype. This allows you to add plugins, or add your 
instance variables.

```js
var Person = Ento()
  .use(Ento.persistence) // plugin
  .use(Ento.validation)  // plugin
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

### Feature comparison

Here's how Ento compares to other model libraries:

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

Hello
-----

### Ento

Subclasses [Ento.object].

```js
var Model = Ento();
```

### Ento.object

The parent class of everything.

Static methods
--------------

### Object.attr
> .attr(name)

Registers an attribute with the given `name`. This enables Ento-specific 
features for that given attribute, including:

 - __change tracking__ — you can listen for changes via `.on('change')`.

 - __case normalization__ — attributes can be accessed using *under_scored_keys* 
 or *camelCaseKeys*.

```js
var Article = Ento()
  .attr('id', Number)
  .attr('title')
  .attr('body')
```

Can be called as:

```js
attr('name')
attr('name', function(), Array) // computed properties
attr('name', function(), function())
attr('name', String|Boolean|Date|Number) // coercion
attr('name', { options })
```

### Object.use
> .use(object)

Defines instance methods in the object.

### Object.on
> .on(event, fn)

Listens for a given `event` in all instances, and runs the function `fn`.

```js
var Song = Ento()
  .attr('title')
  .on('change', function () { ... })
  .on('play', function () { ... });
```

### Object.extend
> extend([props])

Subclasses [Ento.object] into a new class. This creates a new
subclass that inherits all of the parent class's methods,
attributes and event listeners.

```js
var Shape = Ento();
var Circle = Shape.extend();
```

A more detailed example: using *.extend()* in a model with
attributes creates a new model with the same attributes, allowing
you to build on top of another model.

```js
var Address = Ento()
  .attr('street')
  .attr('city')
  .attr('zip');

 var ApartmentAddress = Address.extend()
   .attr('unit')
   .attr('apartment');
```

You may also pass an object to *.extend()*. This will use those
objects as properties, like Backbone. This is functionally
equivalent to *.extend().use({...})*.

```js
var User = Ento();
var Admin = User.extend({
  lol: function() { ... }
});
```

### Object.attributes

An object that lists attributes registered with [attr()].

```js
Page = Eton.extend()
  .attr('title')
  .attr('slug');

Page.attributes.title
=> { name: 'title', get: [Function], set: [Function], ... }

Page.attributes.slug
=> { name: 'slug', get: [Function], set: [Function], ... }
```

### Object.attributeNames

Returns property names. Also see [attributes].

```js
Name = ento()
  .attr('first')
  .attr('last');

Name.attributeNames();
=> ['first', 'last']
```

### Object.build
> build([props])

Constructs a new instance. Calling *Model.build()* is functionally-equivalent to
*new Model()*, and is provided for convenience.

```js
var Album = Ento()
  .attr('title')
  .attr('year', Number);

var item = Album.build({
  title: 'Kind of Blue',
  year: 1984
 });
```

This allows you to create singletons:

```js
var Screen = Ento()
  .prop('width')
  .prop('height')
  .prop('ratio', function() { ... }, ['width', 'height'])
  .build({
    width: 200,
    height: 300
  });
```


Events
------

### on('change')

### on('change:attr')

Instances
---------

### instance.get
> .get(attr)

Return the value of the given attribute *attr*. This is the
same as using the getter, except it can do reserved keywords as
well.

```js
var Document = Ento()
  .attr('title')
  .attr('author');

var doc = new Document();
```

Use `instance.get(str)`. This is equivalent to accessing `instance[str]`

```js
doc.title = "Manual";
doc.get('title')  //=> "Manual"
doc.title         //=> "Manual"
```

You can also `.get(array)`:

```js
doc.get('title', 'author');
=>
```

### instance.trigger
> .trigger(event, [args])

Triggers an event `event`. Also triggers the event in the
constructor.

### instance.toJSON
> .toJSON()

Exports as a JSON-like object for serialization.

[fetch()]: #fetch
[save()]: #save
[Ento.object]: #ento-object
