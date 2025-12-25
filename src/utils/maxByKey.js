export const maxByKey = (arr, key) => arr.reduce((a, b) => (a[key] >= b[key] ? a : b), {});
