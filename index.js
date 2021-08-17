const MAP = {
    'number': x => Number.isFinite(x),
    'array': x => Array.isArray(x),
    'boolean': x => typeof x === 'boolean',
    'object': x => x !== null && typeof x === 'object',
    'string': x => typeof x === 'string',
    'function': x => typeof x === 'function',
    'defined': x => x !== undefined
};

export default function(obj = {}, typeMap = {}) {
    const result = { ok: true, errors: [] };
    typeMap = { ...MAP, ...typeMap };

    for (let origKey in obj) {
        const isMulti = origKey.slice(-1).toUpperCase() === 'S';
        const typeKey = isMulti ? origKey.slice(0, -1) : origKey;

        if (typeKey in typeMap) {
            const fn = typeMap[typeKey];
            const x = obj[origKey];

            if (isMulti) {
                if (!MAP.array(x)) continue;
                for (let i = 0, len = x.length; i < len; i++) {
                    if (!fn(x[i])) addError(result, typeKey, x[i]);
                }
            } else if (!fn(x)) {
                addError(result, typeKey, x);
            }
        }
    }

    return result;
}

function addError(result, type, x) {
    if (result.ok) result.ok = false;
    const str = !MAP.defined(x) ? 'undefined' : JSON.stringify(x);
    result.errors.push(TypeError(`Expected ${type} but got ${typeof x}: ${str.length >= 25 ? str.slice(0, 25) + '...' : str}`));
}