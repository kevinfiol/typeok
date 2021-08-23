# typeok

A tiny type-checking utility.

```js
import typecheck from 'typeok';

typecheck({ numbers: [1, 2, 'notanumber'], string: 'typeok' });
// { ok: false, errors: [TypeError: Expected number but got string: "notanumber"] }
```

## Install

Node
```bash
npm install typeok
```

Deno
```bash
import typecheck from 'https://deno.land/x/typeok/index.js';
```

Browser
```html
<script src="https://unpkg.com/typeok/dist/typeok.min.js"></script>
```

In the browser context, the default function name is `typeok`.

[Try in Flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBGADGgNCAZhBAzsgNqgB2AhmIkiAHQAWALmLCNgMYD2ZT8vyECAC+mclRr0AVkU48+A2giYACAE7wCAbgA6ZPQHoDKgEIUCEDioCqBCgHN4ejQRUBeFUwCeAB3hcAawAKYD0VcJUuACMpeA4mJBVgUTCIsgBXMCj4NUSUTFTwgiY1CDJ7AkTiAHIeeGrMFWqmAHcuaoBdArIIlQo1NQovSpViYnyVACYu0erIAA94KAak0RUM2FgOjr1hAEpdfTJuMgIuBDpYLnsg6oAFcwJNRJWXA71DYwAVX3gAWg4DDiARUAHkAG45UpQTTOTTuTy-QIhVIZLI5RIAVl2jVCPXWmWyuRU83cAD4VAA5Qk5OgQAgAMTKED4QXmexUADJOSSVBTsWR9oc9CczhcrjdqgyKPhXC0WQwVCgVD8-ABRAZcYmvTTvI5GFQAdUGPh8ZXsiL8gRFPGKKjAXghUOg8I8ePCADUKLBoNT0cS2Y16Ry3BT6XQ0US2RzubyKZMuTzSQAeFQAFl2wuOttU3j8gOBCOiUnJlv8wWLjQdToGLoIerhrg8ebiQI4wXdKi9PqgfqJIxqZC4qgoBP9KwAzI1MTtBQ3s6dzvBLtdbtLZSp5UxFQnVfANWotSMdfWtOwQE8EPEILbBBO0EgJyIxCBKNRBHQOARZCATgomIIIhdCAPpkAERBIKQr4SIILaBOe6RqGwtDMEwPiVEY6RkD4AT2J+XBgAYcEBAAAmgdBpnQaAGFA9JMERSIBHQkBkHQMjni2ggEBwpQ+ABwgdMIQA).

## Usage

Pass an object to the typecheck function where the given keys correspond to the types, and the values are the variables you'd like to typecheck. Simply append an `s` to a key string when you'd like to typecheck multiple variables of the same type, for example, `strings` or `objects`. Unrecognized types are ignored.

`typeok` returns an object, `{ ok: boolean, errors: TypeError[] }` for every check.

```js
typecheck({
    object: {},
    number: 1,
    strings: ['one', 'two'],
    arrays: [[1, 2], ['mixed', {}, null]]
});

// { ok: true, errors: [] }
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
typecheck({ object: [] }, { object: x => typeof x === 'object' && !Array.isArray(x) });
// { ok: false, errors: [TypeError: Expected object but got object: []] }
```

You may want to piggyback on the built-in typecheckers in your own custom typecheckers, in which case, the built-in type-map is provided as a second argument for all typecheckers:

```js
typecheck({ object: [] }, { object: (x, is) => is.object(x) && !Array.isArray(x) });
// { ok: false, errors: [TypeError: Expected object but got object: []] }
```

It may get tedious passing the same overrides every single time you need to check your variables, in which case, you can easily wrap the default `typeok` function:

```js
import typeok from 'typeok';

const overrides = { MinimumAge: (x, is) => is.number(x) && x >= 21 };
const typecheck = obj => typeok(obj, overrides);

typecheck({ MinimumAge: 20 });
// { ok: false, errors: [TypeError: Expected MinimumAge but got number: 20] }
```

## Credits

Check out [jty](https://github.com/userpixel/jty) by [Alex Ewerlöf](https://github.com/userpixel), which was the original inspiration for this utility.