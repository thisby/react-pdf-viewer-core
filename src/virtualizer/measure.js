import { ScrollMode } from '../structs/ScrollMode';
const ZERO_OFFSET = {
    left: 0,
    top: 0,
};
export const measure = (numberOfItems, parentRect, sizes, scrollMode) => {
    const measurements = [];
    let totalWidth = 0;
    let firstOfRow = {
        left: 0,
        top: 0,
    };
    let maxHeight = 0;
    let start = ZERO_OFFSET;
    for (let i = 0; i < numberOfItems; i++) {
        const size = sizes[i];
        if (i === 0) {
            totalWidth = size.width;
            firstOfRow = {
                left: 0,
                top: 0,
            };
            maxHeight = size.height;
        }
        else {
            switch (scrollMode) {
                case ScrollMode.Wrapped:
                    totalWidth += size.width;
                    if (totalWidth < parentRect.width) {
                        start = {
                            left: measurements[i - 1].end.left,
                            top: firstOfRow.top,
                        };
                        maxHeight = Math.max(maxHeight, size.height);
                    }
                    else {
                        totalWidth = size.width;
                        start = {
                            left: firstOfRow.left,
                            top: firstOfRow.top + maxHeight,
                        };
                        firstOfRow = {
                            left: start.left,
                            top: start.top,
                        };
                        maxHeight = size.height;
                    }
                    break;
                case ScrollMode.Horizontal:
                case ScrollMode.Vertical:
                default:
                    start = measurements[i - 1].end;
                    break;
            }
        }
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
