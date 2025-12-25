export const roundToDivide = (a, b) => {
    const remainder = a % b;
    return remainder === 0 ? a : Math.floor(a - remainder);
};
