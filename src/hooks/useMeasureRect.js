'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
const rectReducer = (state, action) => {
    const rect = action.rect;
    return state.height !== rect.height || state.width !== rect.width ? rect : state;
};
export const useMeasureRect = ({ elementRef }) => {
    const [element, setElement] = React.useState(elementRef.current);
    const initializedRectRef = React.useRef(false);
    const [rect, dispatch] = React.useReducer(rectReducer, { height: 0, width: 0 });
    useIsomorphicLayoutEffect(() => {
        if (elementRef.current !== element) {
            setElement(elementRef.current);
        }
    });
    useIsomorphicLayoutEffect(() => {
        if (element && !initializedRectRef.current) {
            initializedRectRef.current = true;
            const { height, width } = element.getBoundingClientRect();
            dispatch({
                rect: { height, width },
            });
        }
    }, [element]);
    React.useEffect(() => {
        if (!element) {
            return;
        }
        const tracker = new ResizeObserver((entries, __) => {
            entries.forEach((entry) => {
                if (entry.target === element) {
                    const { height, width } = entry.contentRect;
                    dispatch({
                        rect: { height, width },
                    });
                }
            });
        });
        tracker.observe(element);
        return () => {
            tracker.unobserve(element);
        };
    }, [element]);
    return rect;
};
