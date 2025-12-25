import { Position } from '../structs/Position';
import { clamp } from './clamp';
const AVAILABLE_POSITIONS = [
    Position.TopLeft,
    Position.TopCenter,
    Position.TopRight,
    Position.RightTop,
    Position.RightCenter,
    Position.RightBottom,
    Position.BottomLeft,
    Position.BottomCenter,
    Position.BottomRight,
    Position.LeftTop,
    Position.LeftCenter,
    Position.LeftBottom,
];
const isIntersection = (a, b) => b.right >= a.left && b.left <= a.right && b.top <= a.bottom && b.bottom >= a.top;
const union = (a, b) => {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
};
const calculateArea = (rect) => rect.width * rect.height;
const distance = (a, b) => Math.abs(a.left - b.left) + Math.abs(a.top - b.top);
const calculateOffset = (referenceRect, targetRect, position, offset) => {
    let top = 0;
    let left = 0;
    switch (position) {
        case Position.TopLeft:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left;
            break;
        case Position.TopCenter:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.TopRight:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;
        case Position.RightTop:
            top = referenceRect.top;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.RightCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.RightBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.BottomLeft:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left;
            break;
        case Position.BottomCenter:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.BottomRight:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;
        case Position.LeftTop:
            top = referenceRect.top;
            left = referenceRect.left - targetRect.width - offset;
            break;
        case Position.LeftCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left - targetRect.width - offset;
            break;
        case Position.LeftBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left - targetRect.width - offset;
            break;
        default:
            break;
    }
    return { top, left };
};
export const determineBestPosition = (referenceRect, targetRect, containerRect, position, offset) => {
    if (!isIntersection(referenceRect, containerRect)) {
        return {
            position,
        };
    }
    const desiredOffset = calculateOffset(referenceRect, targetRect, position, offset);
    const availableOffsets = AVAILABLE_POSITIONS.map((pos) => ({
        offset: calculateOffset(referenceRect, targetRect, pos, offset),
        position: pos,
    }));
    const notOverflowOffsets = availableOffsets.filter(({ offset }) => {
        const rect = new DOMRect(offset.left, offset.top, targetRect.width, targetRect.height);
        return isIntersection(rect, containerRect);
    });
    const sortedDistances = notOverflowOffsets.sort((a, b) => {
        const x = new DOMRect(b.offset.left, b.offset.top, targetRect.width, targetRect.height);
        const y = new DOMRect(a.offset.left, a.offset.top, targetRect.width, targetRect.height);
        return (calculateArea(union(x, containerRect)) - calculateArea(union(y, containerRect)) ||
            distance(a.offset, desiredOffset) - distance(b.offset, desiredOffset));
    });
    if (sortedDistances.length === 0) {
        return {
            position,
        };
    }
    const bestPlacement = sortedDistances[0];
    const shortestDistanceRect = new DOMRect(bestPlacement.offset.left, bestPlacement.offset.top, targetRect.width, targetRect.height);
    const rect = new DOMRect(Math.round(clamp(shortestDistanceRect.left, containerRect.left, containerRect.right - shortestDistanceRect.width)), Math.round(clamp(shortestDistanceRect.top, containerRect.top, containerRect.bottom - shortestDistanceRect.height)), shortestDistanceRect.width, shortestDistanceRect.height);
    return {
        position: bestPlacement.position,
        rect,
    };
};
