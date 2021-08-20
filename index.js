let MAP = {
    'number': x => Number.isFinite(x),
    'array': x => Array.isArray(x),
    'boolean': x => typeof x === 'boolean',
    'object': x => x !== null && typeof x === 'object',
    'string': x => typeof x === 'string',
    'function': x => typeof x === 'function',
    'defined': x => x !== undefined
};

export default function(obj = {}, map = {}) {
    let res = { ok: true, errors: [] };
    map = { ...MAP, ...map };

    for (let oKey in obj) {
        let
            isMulti = oKey.slice(-1).toUpperCase() === 'S',
            key = isMulti ? oKey.slice(0, -1) : oKey;

        if (key in map) {
            let fn = map[key], x = obj[oKey];

            if (isMulti) {
                if (MAP.array(x)) x.map(v => fn(v, MAP) || addError(res, key, v));
            } else fn(x, MAP) || addError(res, key, x);
        }
    }

    return res;
}

function addError(res, type, x) {
    if (res.ok) res.ok = false;
    let str = MAP.defined(x) ? JSON.stringify(x) : 'undefined';
    res.errors.push(TypeError(`Expected ${type} but got ${typeof x}: ${str.length >= 25 ? str.slice(0, 25) + '...' : str}`));
}