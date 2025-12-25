'use client';
import * as React from 'react';
import { useMeasureRect } from '../hooks/useMeasureRect';
import { useScroll } from '../hooks/useScroll';
import { ScrollDirection } from '../structs/ScrollDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { clamp } from '../utils/clamp';
import { indexOfMax } from '../utils/indexOfMax';
import { buildContainerStyles } from './buildContainerStyles';
import { buildItemContainerStyles } from './buildItemContainerStyles';
import { buildItemStyles } from './buildItemStyles';
import { calculateRange } from './calculateRange';
import { measure } from './measure';
import { measureDualPage } from './measureDualPage';
import { measureDualPageWithCover } from './measureDualPageWithCover';
import { measureSinglePage } from './measureSinglePage';
const ZERO_RECT = {
    height: 0,
    width: 0,
};
const ZERO_OFFSET = {
    left: 0,
    top: 0,
};
const COMPARE_EPSILON = 0.000000000001;
const VIRTUAL_INDEX_ATTR = 'data-virtual-index';
const IO_THRESHOLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
export const useVirtual = ({ enableSmoothScroll, isRtl, numberOfItems, parentRef, setRenderRange, sizes, scrollMode, viewMode, onVisibilityChanged, }) => {
    const [isSmoothScrolling, setSmoothScrolling] = React.useState(false);
    const onSmoothScroll = React.useCallback((isSmoothScrolling) => setSmoothScrolling(isSmoothScrolling), []);
    const scrollModeRef = React.useRef(scrollMode);
    scrollModeRef.current = scrollMode;
    const viewModeRef = React.useRef(viewMode);
    viewModeRef.current = viewMode;
    const scrollDirection = scrollMode === ScrollMode.Wrapped || viewMode === ViewMode.DualPageWithCover || viewMode === ViewMode.DualPage
        ? ScrollDirection.Both
        : scrollMode === ScrollMode.Horizontal
            ? ScrollDirection.Horizontal
            : ScrollDirection.Vertical;
    const { scrollOffset, scrollTo } = useScroll({
        elementRef: parentRef,
        enableSmoothScroll,
        isRtl,
        scrollDirection,
        onSmoothScroll,
    });
    const parentRect = useMeasureRect({
        elementRef: parentRef,
    });
    const latestRef = React.useRef({
        scrollOffset: ZERO_OFFSET,
        measurements: [],
    });
    latestRef.current.scrollOffset = scrollOffset;
    const defaultVisibilities = React.useMemo(() => Array(numberOfItems).fill(-1), []);
    const [visibilities, setVisibilities] = React.useState(defaultVisibilities);
    const intersectionTracker = React.useMemo(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const ratio = entry.isIntersecting ? entry.intersectionRatio : -1;
                const target = entry.target;
                const indexAttribute = target.getAttribute(VIRTUAL_INDEX_ATTR);
                if (!indexAttribute) {
                    return;
                }
                const index = parseInt(indexAttribute, 10);
                if (0 <= index && index < numberOfItems) {
                    onVisibilityChanged(index, ratio);
                    setVisibilities((old) => {
                        old[index] = ratio;
                        return [...old];
                    });
                }
            });
        }, {
            threshold: IO_THRESHOLD,
        });
        return io;
    }, []);
    const measurements = React.useMemo(() => {
        if (scrollMode === ScrollMode.Page && viewMode === ViewMode.SinglePage) {
            return measureSinglePage(numberOfItems, parentRect, sizes);
        }
        if (viewMode === ViewMode.DualPageWithCover) {
            return measureDualPageWithCover(numberOfItems, parentRect, sizes, scrollMode);
        }
        if (viewMode === ViewMode.DualPage) {
            return measureDualPage(numberOfItems, parentRect, sizes, scrollMode);
        }
        return measure(numberOfItems, parentRect, sizes, scrollMode);
    }, [scrollMode, sizes, viewMode, parentRect]);
    const totalSize = measurements[numberOfItems - 1]
        ? {
            height: measurements[numberOfItems - 1].end.top,
            width: measurements[numberOfItems - 1].end.left,
        }
        : ZERO_RECT;
    latestRef.current.measurements = measurements;
    const { startPage, endPage, maxVisbilityIndex } = React.useMemo(() => {
        const { start, end } = calculateRange(scrollDirection, measurements, parentRect, scrollOffset);
        const visiblePageVisibilities = visibilities.slice(clamp(0, numberOfItems, start), clamp(0, numberOfItems, end));
        let maxVisbilityItem = start + indexOfMax(visiblePageVisibilities);
        maxVisbilityItem = clamp(0, numberOfItems - 1, maxVisbilityItem);
        let maxVisbilityIndex = maxVisbilityItem;
        let { startPage, endPage } = setRenderRange({
            endPage: end,
            numPages: numberOfItems,
            startPage: start,
        });
        startPage = Math.max(startPage, 0);
        endPage = Math.min(endPage, numberOfItems - 1);
        switch (viewMode) {
            case ViewMode.DualPageWithCover:
                if (maxVisbilityItem > 0) {
                    maxVisbilityIndex = maxVisbilityItem % 2 === 1 ? maxVisbilityItem : maxVisbilityItem - 1;
                }
                startPage = startPage === 0 ? 0 : startPage % 2 === 1 ? startPage : startPage - 1;
                endPage = endPage % 2 === 1 ? endPage - 1 : endPage;
                if (numberOfItems - endPage <= 2) {
                    endPage = numberOfItems - 1;
                }
                break;
            case ViewMode.DualPage:
                maxVisbilityIndex = maxVisbilityItem % 2 === 0 ? maxVisbilityItem : maxVisbilityItem - 1;
                startPage = startPage % 2 === 0 ? startPage : startPage - 1;
                endPage = endPage % 2 === 1 ? endPage : endPage - 1;
                break;
            case ViewMode.SinglePage:
            default:
                maxVisbilityIndex = maxVisbilityItem;
                break;
        }
        return {
            startPage,
            endPage,
            maxVisbilityIndex,
        };
    }, [measurements, parentRect, scrollOffset, viewMode, visibilities]);
    const virtualItems = React.useMemo(() => {
        const virtualItems = [];
        for (let i = startPage; i <= endPage; i++) {
            const item = measurements[i];
            const virtualItem = Object.assign(Object.assign({}, item), { visibility: visibilities[i] !== undefined ? visibilities[i] : -1, measureRef: (ele) => {
                    if (!ele) {
                        return;
                    }
                    ele.setAttribute(VIRTUAL_INDEX_ATTR, `${i}`);
                    intersectionTracker.observe(ele);
                } });
            virtualItems.push(virtualItem);
        }
        return virtualItems;
    }, [startPage, endPage, visibilities, measurements]);
    const scrollToItem = React.useCallback((index, offset) => {
        const { measurements } = latestRef.current;
        const normalizedIndex = clamp(0, numberOfItems - 1, index);
        const measurement = measurements[normalizedIndex];
        const withOffset = scrollModeRef.current === ScrollMode.Page ? ZERO_OFFSET : offset;
        return measurement
            ? scrollTo({
                left: withOffset.left + measurement.start.left,
                top: withOffset.top + measurement.start.top,
            }, enableSmoothScroll)
            : Promise.resolve();
    }, [scrollTo, enableSmoothScroll]);
    const scrollToSmallestItemAbove = React.useCallback((index, offset) => {
        const { measurements } = latestRef.current;
        const start = measurements[index].start;
        const nextItem = measurements.find((item) => item.start.top - start.top > COMPARE_EPSILON);
        if (!nextItem) {
            return Promise.resolve();
        }
        let nextIndex = nextItem.index;
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                nextIndex = nextIndex % 2 === 0 ? nextIndex : nextIndex + 1;
                break;
            case ViewMode.DualPageWithCover:
                nextIndex = nextIndex % 2 === 1 ? nextIndex : nextIndex + 1;
                break;
            default:
                break;
        }
        return scrollToItem(nextIndex, offset);
    }, []);
    const scrollToBiggestItemBelow = React.useCallback((index, offset) => {
        const { measurements } = latestRef.current;
        const start = measurements[index].start;
        let prevIndex = index;
        let found = false;
        for (let i = numberOfItems - 1; i >= 0; i--) {
            if (start.top - measurements[i].start.top > COMPARE_EPSILON) {
                found = true;
                prevIndex = measurements[i].index;
                break;
            }
        }
        if (!found) {
            return Promise.resolve();
        }
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                prevIndex = prevIndex % 2 === 0 ? prevIndex : prevIndex - 1;
                break;
            case ViewMode.DualPageWithCover:
                prevIndex = prevIndex % 2 === 0 ? prevIndex - 1 : prevIndex;
                break;
            default:
                break;
        }
        if (prevIndex === index) {
            prevIndex = index - 1;
        }
        return scrollToItem(prevIndex, offset);
    }, []);
    const scrollToNextItem = React.useCallback((index, offset) => {
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            return scrollToSmallestItemAbove(index, offset);
        }
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                return scrollToSmallestItemAbove(index, offset);
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                return scrollToItem(index + 1, offset);
        }
    }, []);
    const scrollToPreviousItem = React.useCallback((index, offset) => {
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            return scrollToBiggestItemBelow(index, offset);
        }
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                return scrollToBiggestItemBelow(index, offset);
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                return scrollToItem(index - 1, offset);
        }
    }, []);
    const getContainerStyles = React.useCallback(() => buildContainerStyles(totalSize, scrollModeRef.current), [totalSize]);
    const getItemContainerStyles = React.useCallback((item) => buildItemContainerStyles(item, parentRect, scrollModeRef.current), [parentRect]);
    const getItemStyles = React.useCallback((item) => buildItemStyles(item, isRtl, sizes, viewModeRef.current, scrollModeRef.current), [isRtl, sizes]);
    const zoom = React.useCallback((scale, index) => {
        const { measurements, scrollOffset } = latestRef.current;
        const normalizedIndex = clamp(0, numberOfItems - 1, index);
        const measurement = measurements[normalizedIndex];
        if (measurement) {
            const updateOffset = scrollModeRef.current === ScrollMode.Page
                ? {
                    left: measurement.start.left,
                    top: measurement.start.top,
                }
                : {
                    left: scrollOffset.left * scale,
                    top: scrollOffset.top * scale,
                };
            return scrollTo(updateOffset, false);
        }
        return Promise.resolve();
    }, []);
    React.useEffect(() => {
        return () => {
            intersectionTracker.disconnect();
        };
    }, []);
    return {
        boundingClientRect: parentRect,
        isSmoothScrolling,
        startPage,
        endPage,
        maxVisbilityIndex,
        virtualItems,
        getContainerStyles,
        getItemContainerStyles,
        getItemStyles,
        scrollToItem,
        scrollToNextItem,
        scrollToPreviousItem,
        zoom,
    };
};
