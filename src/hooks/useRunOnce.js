'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
export const useRunOnce = (cb, condition) => {
    const isCalledRef = React.useRef(false);
    useIsomorphicLayoutEffect(() => {
        if (condition && !isCalledRef.current) {
            isCalledRef.current = true;
            cb();
        }
    }, [cb, condition]);
};
