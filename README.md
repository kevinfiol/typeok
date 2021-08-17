# typeok

A tiny type-checking utility.

```js
import typecheck from 'typeok';

const { ok, errors } = typecheck({ numbers: [1, 2, 'notanumber'], string: 'typeok' });

console.log(ok); // false
console.log(errors); // [TypeError: Expected number but got string: "notanumber"]
```

## Basic Usage

Pass an object where the given keys correspond to the type, and the values are the variables you'd like to typecheck. `typeok` returns an object, `{ ok: boolean, errors: TypeError[] }` for every check. Simply append an `s` when you'd like to typecheck multiple variables of the same type, for example, `strings`. Unrecognized types are ignored:

```js
const result = typecheck({
    object: {},
    number: 1,
    strings: ['one', 'two'],
    array: []
})

console.log(result); // { ok: true, errors: [] }
```

`typeok` uses regular `typeof` checks under the hood, and never throws. You can use the [built-in type-checking methods](https://github.com/kevinfiol/typeok/blob/master/index.js#L1) or provide your own. The built-in methods include checks for:

* `number`
* `array`
* `boolean`
* `object`
* `string`
* `function`
* `defined`

*(Note: `[]` will pass the built-in `object` check)*.

## Type Map Override

You can pass an object as a second argument to override or extend the built-in typecheckers.

```js
const { ok, errors } = typecheck({ object: [] }, { object: x => typeof x === 'object' && !Array.isArray(x) });
```

It may get tedious passing the same overrides every single time you need to check your variables, in which case, you can easily wrap the default `typeok` function

```js
import typeok from 'typeok';

const overrides = { MinimumAge: x => Number.isFinite(x) && x >= 21 };
const typecheck = obj => typeok(obj, overrides);

const { ok, errors } = typecheck({ MinimumAge: 20 });

console.log(ok); // false
console.log(errors); // [TypeError: Expected MinimumAge but got number: 20]
```

## Credits

Check out [jty](https://github.com/userpixel/jty) by [Alex Ewerlöf ](https://github.com/userpixel), which was the original inspiration for this utility.