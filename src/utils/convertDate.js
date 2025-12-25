const dateRegex = new RegExp('^D:' +
    '(\\d{4})' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '([Z|+|-])?' +
    '(\\d{2})?' +
    "'?" +
    '(\\d{2})?' +
    "'?");
const parse = (value, min, max, defaultValue) => {
    const parsed = parseInt(value, 10);
    return parsed >= min && parsed <= max ? parsed : defaultValue;
};
export const convertDate = (input) => {
    const matches = dateRegex.exec(input);
    if (!matches) {
        return null;
    }
    const year = parseInt(matches[1], 10);
    const month = parse(matches[2], 1, 12, 1) - 1;
    const day = parse(matches[3], 1, 31, 1);
    let hour = parse(matches[4], 0, 23, 0);
    let minute = parse(matches[5], 0, 59, 0);
    const second = parse(matches[6], 0, 59, 0);
    const universalTimeRelation = matches[7] || 'Z';
    const offsetHour = parse(matches[8], 0, 23, 0);
    const offsetMinute = parse(matches[9], 0, 59, 0);
    switch (universalTimeRelation) {
        case '-':
            hour += offsetHour;
            minute += offsetMinute;
            break;
        case '+':
            hour -= offsetHour;
            minute -= offsetMinute;
            break;
        default:
            break;
    }
    return new Date(Date.UTC(year, month, day, hour, minute, second));
};
