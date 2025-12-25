'use client';
import * as React from 'react';
export const useDebounceCallback = (callback, wait) => {
    const timeout = React.useRef();
    const cleanup = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };
    React.useEffect(() => {
        return () => cleanup();
    }, []);
    return React.useCallback((...args) => {
        cleanup();
        timeout.current = setTimeout(() => {
            callback(...args);
        }, wait);
    }, [callback, wait]);
};
