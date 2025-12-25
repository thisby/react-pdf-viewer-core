import { ScrollDirection } from '../structs/ScrollDirection';
import { findNearest } from '../utils/findNearest';
export const calculateRange = (scrollDirection, measurements, outerSize, scrollOffset) => {
    let currentOffset = 0;
    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            currentOffset = scrollOffset.left;
            break;
        case ScrollDirection.Vertical:
        default:
            currentOffset = scrollOffset.top;
            break;
    }
    const size = measurements.length - 1;
    const getOffset = (index) => {
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                return measurements[index].start.left;
            case ScrollDirection.Both:
            case ScrollDirection.Vertical:
            default:
                return measurements[index].start.top;
        }
    };
    let start = findNearest(0, size, currentOffset, getOffset);
    if (scrollDirection === ScrollDirection.Both) {
        const startTop = measurements[start].start.top;
        while (start - 1 >= 0 &&
            measurements[start - 1].start.top === startTop &&
            measurements[start - 1].start.left >= scrollOffset.left) {
            start--;
        }
    }
    let end = start;
    while (end <= size) {
        const topLeftCorner = {
            top: measurements[end].start.top - scrollOffset.top,
            left: measurements[end].start.left - scrollOffset.left,
        };
        const visibleSize = {
            height: outerSize.height - topLeftCorner.top,
            width: outerSize.width - topLeftCorner.left,
        };
        if (scrollDirection === ScrollDirection.Horizontal && visibleSize.width < 0) {
            break;
        }
        if (scrollDirection === ScrollDirection.Vertical && visibleSize.height < 0) {
            break;
        }
        if (scrollDirection === ScrollDirection.Both && (visibleSize.width < 0 || visibleSize.height < 0)) {
            break;
        }
        end++;
    }
    return {
        start,
        end,
    };
};
