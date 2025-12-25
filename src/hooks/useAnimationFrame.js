'use client';
import * as React from 'react';
export const useAnimationFrame = (callback, recurring = false, deps) => {
    const callbackRef = React.useRef(callback);
    const idRef = React.useRef(-1);
    callbackRef.current = callback;
    const start = React.useCallback((...args) => {
        cancelAnimationFrame(idRef.current);
        idRef.current = requestAnimationFrame(() => {
            callback(...args);
            if (recurring) {
                start(...args);
            }
        });
    }, [...deps, recurring]);
    const stop = React.useCallback(() => {
        cancelAnimationFrame(idRef.current);
    }, []);
    React.useEffect(() => () => stop(), []);
    return [start];
};
