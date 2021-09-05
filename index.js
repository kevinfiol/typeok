let MAP = {
    'number': x => Number.isFinite(x),
    'array': x => Array.isArray(x),
    'boolean': x => typeof x == 'boolean',
    'object': x => x != null && typeof x == 'object',
    'string': x => typeof x == 'string',
    'function': x => typeof x == 'function',
    'defined': x => x != undefined
};

export function check(obj = {}, map = {}) {
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

export function schema(schema, map = {}) {
    return obj => validate(schema, obj, { ok: true, errors: [] }, { ...MAP, ...map });
}

function validate(schema, obj, res, map, name) {
    for (let [key, type] of Object.entries(schema)) {
        name = name ? name+'.'+key : key;
        if (!(key in obj)) addError(res, 'defined', obj[key], name);
        else if (MAP.string(type)) map[type](obj[key]) || addError(res, type, obj[key], name);
        else if (MAP.object(type)) validate(schema[key], obj[key], res, map, name);
    }

    return res;
};

function addError(res, type, x, name) {
    if (res.ok) res.ok = false;
    res.errors.push(TypeError(`Expected ${type}, got: ${x}${name ? ` (${name})`: ''}`));
}