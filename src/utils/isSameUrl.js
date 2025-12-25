export const isSameUrl = (a, b) => {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === 'string' && typeB === 'string' && a === b) {
        return true;
    }
    if (typeA === 'object' && typeB === 'object') {
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }
    return false;
};
