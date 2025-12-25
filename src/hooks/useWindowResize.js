'use client';
import * as React from 'react';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
const RESIZE_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};
const ZERO_RECT = {
    height: 0,
    width: 0,
};
export const useWindowResize = () => {
    const [windowRect, setWindowRect] = React.useState(ZERO_RECT);
    const handleResize = useDebounceCallback(() => {
        setWindowRect({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }, 100);
    useIsomorphicLayoutEffect(() => {
        window.addEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        return () => {
            window.removeEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        };
    }, []);
    return windowRect;
};
