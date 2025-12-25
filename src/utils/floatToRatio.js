export const floatToRatio = (x, limit) => {
    if (Math.floor(x) === x) {
        return [x, 1];
    }
    const y = 1 / x;
    if (y > limit) {
        return [1, limit];
    }
    if (Math.floor(y) === y) {
        return [1, y];
    }
    const value = x > 1 ? y : x;
    let a = 0;
    let b = 1;
    let c = 1;
    let d = 1;
    while (true) {
        let numerator = a + c;
        let denominator = b + d;
        if (denominator > limit) {
            break;
        }
        value <= numerator / denominator ? ([c, d] = [numerator, denominator]) : ([a, b] = [numerator, denominator]);
    }
    const middle = (a / b + c / d) / 2;
    return value < middle ? (value === x ? [a, b] : [b, a]) : value === x ? [c, d] : [d, c];
};
