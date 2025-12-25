import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { chunk } from '../utils/chunk';
const hasDifferentSizes = (sizes) => {
    const numberOfItems = sizes.length;
    if (numberOfItems === 1) {
        return false;
    }
    for (let i = 1; i < numberOfItems; i++) {
        if (sizes[i].height !== sizes[0].height || sizes[i].width !== sizes[0].width) {
            return true;
        }
    }
    return false;
};
const getMinWidthOfCover = (sizes, viewMode) => {
    if (viewMode !== ViewMode.DualPageWithCover) {
        return 0;
    }
    if (!hasDifferentSizes(sizes)) {
        return 2 * sizes[0].width;
    }
    const chunkWidths = chunk(sizes.slice(1), 2).map((eachChunk) => eachChunk.length === 2 ? eachChunk[0].width + eachChunk[1].width : eachChunk[0].width);
    const widths = [sizes[0].width].concat(chunkWidths);
    return Math.max(...widths);
};
export const buildItemStyles = (item, isRtl, sizes, viewMode, scrollMode) => {
    const sideProperty = isRtl ? 'right' : 'left';
    const factor = isRtl ? -1 : 1;
    const numberOfItems = sizes.length;
    const left = item.start.left * factor;
    const { height, width } = item.size;
    if (viewMode === ViewMode.DualPageWithCover) {
        const transformTop = scrollMode === ScrollMode.Page ? 0 : item.start.top;
        if (item.index === 0 || (numberOfItems % 2 === 0 && item.index === numberOfItems - 1)) {
            return {
                height: `${height}px`,
                minWidth: `${getMinWidthOfCover(sizes, viewMode)}px`,
                width: '100%',
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translate(${left}px, ${transformTop}px)`,
            };
        }
        return {
            height: `${height}px`,
            width: `${width}px`,
            [sideProperty]: 0,
            position: 'absolute',
            top: 0,
            transform: `translate(${left}px, ${transformTop}px)`,
        };
    }
    if (viewMode === ViewMode.DualPage) {
        return {
            height: `${height}px`,
            width: `${width}px`,
            [sideProperty]: 0,
            position: 'absolute',
            top: 0,
            transform: `translate(${left}px, ${scrollMode === ScrollMode.Page ? 0 : item.start.top}px)`,
        };
    }
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return {
                height: '100%',
                width: `${width}px`,
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translateX(${left}px)`,
            };
        case ScrollMode.Page:
            return {
                height: `${height}px`,
                width: `${width}px`,
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
            };
        case ScrollMode.Wrapped:
            return {
                height: `${height}px`,
                width: `${width}px`,
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translate(${left}px, ${item.start.top}px)`,
            };
        case ScrollMode.Vertical:
        default:
            return {
                height: `${height}px`,
                width: '100%',
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translateY(${item.start.top}px)`,
            };
    }
};
