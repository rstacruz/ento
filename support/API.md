<a name="Ento"></a>
## Ento

Creates a model subclass.

```js
var Model = Ento();
```

<a name="Object"></a>
## Object



<a name="attributes"></a>
### attributes `Object`

List of attributes registered with [attr()].

```js
Page = Eton.extend()
  .attr('title')
  .attr('slug');

Page.attributes.title
=> { name: 'title', get: [Function], set: [Function], ... }

Page.attributes.slug
=> { name: 'slug', get: [Function], set: [Function], ... }
```

<a name="attr"></a>
### attr `attr(name, [...])`

Registers an attribute.

Can be called as:

```js
attr('name')
attr('name', function())
attr('name', function(), function())
attr('name', String|Boolean|Date|Number)
attr('name', { options })
```

Possible options:

* `get` <span class='dash'>&mdash;</span> getter function
* `set` <span class='dash'>&mdash;</span> setter function
* `type` <span class='dash'>&mdash;</span> type to coerce to. can be String | Boolean | Date | Number
* `enumerable: shows up in keys. (default` <span class='dash'>&mdash;</span> true)

<a name="attributeNames"></a>
### attributeNames

returns property names.

```js
Name = ento()
  .attr('first')
  .attr('last');

Name.attributeNames();
=> ['first', 'last']
```

<a name="use"></a>
### use `use(...)`

uses a mixin.
Extends the model with a given plugin. When passed an *Object*, the
prototype is extended with it (see first example). When passed a
*Function*, it is called and passed the model as the first parameter,
allowing you to extend the model in any way.

* `use(props, [staticProps])` <span class='dash'>&mdash;</span>
  extends the prototype with `props` (*Object*). optionally, you can pass
  `staticProps` too to extend the object itself.
* `use(fn)` <span class='dash'>&mdash;</span>
  call `fn` (*Function*), passing the model as the first argument. This
  allows you to extend the class in whatever way you wish.

An example of using `.use()` with an *Object*:

```js
var Person = ento()
  .attr('name')
  .use({
    greet: function() {
      alert("Hello, " + this.name);
    }
  })
```

An example of using `.use()` with a *Function*:

```js
var Timestamps = function (model) {
  model
    .attr('createdAt')
    .attr('updatedAt');
}

var Record = ento().use(Timestamps);
```

<a name="extend"></a>
### extend `extend([props])`

Subclasses [ento.object] into a new class. This creates a new
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

<a name="api"></a>
### api `api()`

sets or gets the api object.

```js
var db = {
  sync: function(){ ... }
};

Model = Ento()
  .api(db);
```

<a name="build"></a>
### build `build([props])`

constructor. Calling *Model.build()* is functionally-equivalent to
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

<a name="Instance_attributes"></a>
## Instance attributes



<a name="raw"></a>
### raw

raw data

<a name="is"></a>
### is

states

<a name="api"></a>
### api

Root instance

<a name="Object_events"></a>
## Object events


There are some events available.

* `build` <span class='dash'>&mdash;</span> triggered when building
* `init` <span class='dash'>&mdash;</span> when initializing
* `change` <span class='dash'>&mdash;</span> when properties are changed
* `change:attr` <span class='dash'>&mdash;</span> when a given attribute is changed

<a name="Object_instances"></a>
## Object instances



<a name="init"></a>
### init

The constructor. Override this.

```js
Model = Ento()
  .use({
    init: function() {
    })
  });
```

<a name="set"></a>
### set `set(key, value)`

Sets a `key` to `value`. If a setter function is available, use it.

```js
.set({ title: 'House of Holes' });
.set('title', 'House of Holes');
```

<a name="get"></a>
### get `get(attr)`

return the value of the given attribute *attr*. This is the
same as using the getter, except it can do reserved keywords as
well.

```js
var Document = Ento()
  .attr('title')
  .attr('author');

var doc = new Document();

doc.title = "Manual";
doc.get('title')  //=> "Manual"
doc.title         //=> "Manual"
```

<a name="trigger"></a>
### trigger `trigger(event)`

triggers an event `event`. Also triggers the event in the
constructor.

<a name="toJSON"></a>
### toJSON

exports as a JSON-like object for serialization

<a name="Relations"></a>
## Relations

You can describe relations using [hasOne], [hasMany], and [belongsTo].

```js
Person = Ento()
  .use(Ento.relations)
  .hasOne('book', { as: 'author' }, function() { return Book; })

Book = Ento()
  .use(Ento.relations)
  .belongsTo('author', { as: 'book' }, function() { return Person; })
```

<a name="hasOne"></a>
### hasOne `hasOne(attribute, options, class)`

Creates a relation. See [Relations] for an example.

The `options` parameter can have:

* `as` *(string)* <span class='dash'>&mdash;</span> the name of the attribute in the child class that
describes the inverse relationship.

This creates a custom attribute. When set, it will automatically
instanciate it.

```js
q = new Question({ title: 'Why is the sky blue?' });
q.answer = { body: 'It reflects the ocean' };

q.answer // is of type `Answer`
```

The parameter `class` is a function that returns a class, such as
*function() { return Book; }*. The reason for this is that it lets Ento
lazy-load the class only when it's needed, allowing you to create
circular relationships (eg: Album has many Songs, and Song has one
Album).

```js
var Answer = function() { return require('./answer'); }

Question = Ento()
  .use(Ento.relations)
  .hasOne('answer', {as: 'question'}, Answer);
```

If `as` is given, the child will be updated to have a link to the
parent. In the example above, you can:

```js
q = new Question({ title: 'Why is the sky blue?' });
q.answer = { body: 'It reflects the ocean' };

// `.question` is automatically set, because of `as: 'question'`
q.answer.question == q
```

Another example:

```js
book.author = { id: 3, name: 'Jake' }
book.author       // is of type `Person`
book.author.book  // link to parent `book`
```

<a name="belongsTo"></a>
### belongsTo `belongsTo(attribute, options, class)`

Creates a relation. Works exactly like [hasOne], but also accounts for a
*child_id* attribute.

See [hasOne] for documentation on how *belongsTo* works.

```js
book.author = { id: 3, name: 'John' }
book.author_id //=> 3
```
