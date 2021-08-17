import typecheck from './dist/typeok.js';
import { equal } from 'assert';

let res;
let passes = 0;
let failures = 0;

test('Should pass with right types', () => {
    res = typecheck({
        number: 1,
        string: 'foo',
        boolean: true,
        object: {},
        array: [],
        function: () => {},
        defined: 1
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);
});

test('Should pass testing multiples type keys', () => {
    res = typecheck({
        numbers: [1,2,3],
        strings: ['one', 'two', 'three'],
        booleans: [true, true, false],
        objects: [{a: 1}, {b: 2}, {c: 3}],
        arrays: [
            [1, 2, 3],
            [3, 4, 5]
        ],
        functions: [
            () => 0,
            () => 1,
            () => 2,
        ],
        defineds: [
            'anything',
            42,
            {},
            [],
            false,
            () => 3
        ]
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);
});

test('Should fail on incorrect types', () => {
    res = typecheck({
        number: 'notanumber',
        string: 2,
        boolean: [],
        object: 'notanobject',
        array: {},
        defined: undefined,
        function: 'notafunction'
    });

    equal(res.ok, false);
    equal(res.errors.length, 7);
});

test('Should fail testing multiples type keys', () => {
    res = typecheck({
        numbers: [1, 'string', 3],
        strings: ['one', 'two', 'three', 15],
        booleans: [true, 2],
        objects: [{}, {}, false],
        arrays: [[], [], {}],
        defineds: [1, 2, 3, undefined, 5],
        functions: [
            () => {},
            'notafunction',
            () => {}
        ]
    });

    equal(res.ok, false);
    equal(res.errors.length, 7);
});

test('Test type map overriding', () => {
    res = typecheck({
        number: 'notanumber'
    }, {
        number: x => typeof x === 'string'
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);
});

test('Test type map overriding #2', () => {
    let map = {
        number: x => typeof x === 'number' && x >= 20,
        ConstrainedNumber: x => Number.isFinite(x) && x > 10 && x < 15
    };

    res = typecheck({ number: 20 }, map);

    equal(res.ok, true);
    equal(res.errors.length, 0);

    res = typecheck({ number: 19, string: 'thisisastring' }, map);

    equal(res.ok, false);
    equal(res.errors.length, 1);

    res = typecheck({ ConstrainedNumber: 2 }, map);
    equal(res.ok, false);
    equal(res.errors.length, 1);

    res = typecheck({ ConstrainedNumber: 11 }, map);
    equal(res.ok, true);
    equal(res.errors.length, 0);

    res = typecheck({ ConstrainedNumber: 21, number: 19 }, map);
    equal(res.ok, false);
    equal(res.errors.length, 2);
});

test('Test type map override #3', () => {
    const overrides = { MinimumAge: x => Number.isFinite(x) && x >= 21 };
    const customTypecheck = obj => typecheck(obj, overrides);

    res = customTypecheck({ MinimumAge: 20 });
    equal(res.ok, false);
    equal(res.errors.length, 1);
});

console.log(`Tests Passed ✓: ${passes}`);
console.warn(`Tests Failed ✗: ${failures}`);

if (failures.length) throw Error(`Tests failed with ${failures.length} failing tests.`);

function test(label, cb) {
    try {
        cb();
        passes += 1;
    } catch(e) {
        failures += 1;
        console.error(`Failed Test: "${label}", at ${e.message}`)
    }
}