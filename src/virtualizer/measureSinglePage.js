const ZERO_OFFSET = {
    left: 0,
    top: 0,
};
export const measureSinglePage = (numberOfItems, parentRect, sizes) => {
    const measurements = [];
    for (let i = 0; i < numberOfItems; i++) {
        const size = {
            height: Math.max(parentRect.height, sizes[i].height),
            width: Math.max(parentRect.width, sizes[i].width),
        };
        const start = i === 0 ? ZERO_OFFSET : measurements[i - 1].end;
        const end = {
            left: start.left + size.width,
            top: start.top + size.height,
        };
        measurements[i] = {
            index: i,
            start,
            size,
            end,
            visibility: -1,
        };
    }
    return measurements;
};
