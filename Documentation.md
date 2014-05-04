ento.js
=======

Feature overview
----------------

### Change tracking

### Case normalization

### Persistence

### Validations

### Relations

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

### intsance.toJSON
> .toJSON()

Exports as a JSON-like object for serialization.
