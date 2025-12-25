'use client';
import * as React from 'react';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { determineBestPosition } from '../utils/determineBestPosition';
import { Stack } from './Stack';
const areRectsEqual = (a, b) => ['top', 'left', 'width', 'height'].every((key) => a[key] === b[key]);
export const Portal = ({ children, offset = 0, position, referenceRef }) => {
    const EMPTY_DOM_RECT = new DOMRect();
    const [ele, setEle] = React.useState();
    const [updatedPosition, setUpdatedPosition] = React.useState(position);
    const targetRef = React.useCallback((ele) => {
        setEle(ele);
    }, []);
    const prevBoundingRectsRef = React.useRef([]);
    const [start] = useAnimationFrame(() => {
        if (!ele || !referenceRef.current) {
            return;
        }
        const referenceRect = referenceRef.current.getBoundingClientRect();
        const targetRect = ele.getBoundingClientRect();
        const containerRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
        const rects = [referenceRect, targetRect, containerRect];
        if (rects.some((rect, i) => !areRectsEqual(rect, prevBoundingRectsRef.current[i] || EMPTY_DOM_RECT))) {
            prevBoundingRectsRef.current = rects;
            const updatedPlacement = determineBestPosition(referenceRect, targetRect, containerRect, position, offset);
            if (updatedPlacement.rect) {
                ele.style.transform = `translate(${updatedPlacement.rect.left}px, ${updatedPlacement.rect.top}px)`;
                setUpdatedPosition(updatedPlacement.position);
            }
        }
    }, true, [ele]);
    React.useEffect(() => {
        if (ele) {
            start();
        }
    }, [ele]);
    return React.createElement(Stack, null, children({ position: updatedPosition, ref: targetRef }));
};
