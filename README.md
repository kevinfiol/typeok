# typeok

A tiny type-checking utility.

```js
import typecheck from 'typeok';

let result = typecheck({ numbers: [1, 2, 'notanumber'], string: 'typeok' });
console.log(result); // { ok: false, errors: [TypeError: Expected number but got string: "notanumber"] }
```

## Install

Node
```bash
npm install typeok
```

Browser
```html
<script src="https://unpkg.com/typeok/dist/typeok.min.js"></script>
```

## Usage

Pass an object to the typecheck function where the given keys correspond to the types, and the values are the variables you'd like to typecheck. Simply append an `s` to a key string when you'd like to typecheck multiple variables of the same type, for example, `strings` or `objects`. Unrecognized types are ignored.

`typeok` returns an object, `{ ok: boolean, errors: TypeError[] }` for every check.

```js
let result = typecheck({
    object: {},
    number: 1,
    strings: ['one', 'two'],
    arrays: [[1, 2], ['mixed', {}, null]]
});

console.log(result); // { ok: true, errors: [] }
```

`typeok` uses regular `typeof` checks under the hood, and never throws. You can use the [built-in typecheckers](https://github.com/kevinfiol/typeok/blob/master/index.js#L1) or provide your own. The built-in typecheckers include checks for:

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
let result = typecheck({ object: [] }, {
    object: x => typeof x === 'object' && !Array.isArray(x)
});
```

It may get tedious passing the same overrides every single time you need to check your variables, in which case, you can easily wrap the default `typeok` function:

```js
import typeok from 'typeok';

const overrides = { MinimumAge: x => Number.isFinite(x) && x >= 21 };
const typecheck = obj => typeok(obj, overrides);

let result = typecheck({ MinimumAge: 20 });
console.log(result); // { ok: false, errors: [TypeError: Expected MinimumAge but got number: 20] }
```

## Credits

Check out [jty](https://github.com/userpixel/jty) by [Alex Ewerlöf](https://github.com/userpixel), which was the original inspiration for this utility.