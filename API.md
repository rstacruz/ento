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

~ use(props, [staticProps]) :
  extends the prototype with `props`. optionally, you can pass
  `staticProps` too to extend the object itself.
~ use(fn) :
  call the function `fn`, passing the model as the first argument. This
  allows you to extend the class in whatever way you wish.

Example:

```js
var Person = ento()
  .attr('name')
  .use({
    greet: function() {
      alert("Hello, " + this.name);
    }
  })
```

Or as a function:

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
