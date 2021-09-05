let MAP = {
    'number': Number.isFinite,
    'array': Array.isArray,
    'boolean': x => typeof x == 'boolean',
    'object': x => x != null && typeof x == 'object',
    'string': x => typeof x == 'string',
    'function': x => typeof x == 'function',
    'defined': x => x != undefined
};

export default function(obj, map = {}) {
    let res = { ok: true, errors: [] };
    map = { ...MAP, ...map };

    for (let oKey in obj) {
        let
            isMulti = oKey.slice(-1) == 's',
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
    res.errors.push(TypeError(`Expected ${type}, got: ${x}`));
}