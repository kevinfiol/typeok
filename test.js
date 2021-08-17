import typecheck from './index.js';
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
    console.log(res);
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

console.log(`Tests Passed ✓: ${passes}`);
console.warn(`Tests Failed ✗: ${failures}`);

function test(label, cb) {
    try {
        cb();
        passes += 1;
    } catch(e) {
        failures += 1;
        console.error(`Failed Test: "${label}"`)
    }
}