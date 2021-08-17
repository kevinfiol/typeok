const MAP = {
    'number': x => Number.isFinite(x),
    'array': x => Array.isArray(x),
    'boolean': x => typeof x === 'boolean',
    'object': x => x !== null && typeof x === 'object',
    'string': x => typeof x === 'string',
    'function': x => typeof x === 'function',
    'defined': x => x !== undefined
};

export default function(obj = {}, map = {}) {
    const res = { ok: true, errors: [] };
    map = { ...MAP, ...map };

    for (let oKey in obj) {
        const
            isMulti = oKey.slice(-1).toUpperCase() === 'S',
            key = isMulti ? oKey.slice(0, -1) : oKey;

        if (key in map) {
            const fn = map[key], x = obj[oKey];

            if (isMulti) {
                if (!MAP.array(x)) continue;
                for (let i = 0, len = x.length; i < len; i++) {
                    if (!fn(x[i])) addError(res, key, x[i]);
                }
            } else if (!fn(x)) addError(res, key, x);
        }
    }

    return res;
}

function addError(res, type, x) {
    if (res.ok) res.ok = false;
    const str = !MAP.defined(x) ? 'undefined' : JSON.stringify(x);
    res.errors.push(TypeError(`Expected ${type} but got ${typeof x}: ${str.length >= 25 ? str.slice(0, 25) + '...' : str}`));
}