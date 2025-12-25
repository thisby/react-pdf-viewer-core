'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Breakpoint } from '../structs/Breakpoint';
import { determineBreakpoint } from './determineBreakpoint';
export const useBreakpoint = () => {
    const [node, setNode] = React.useState(null);
    const [breakpoint, setBreakpoint] = React.useState(Breakpoint.ExtraSmall);
    const resizeCallback = React.useCallback((entries) => {
        entries.forEach((entry) => {
            const rect = entry.target.getBoundingClientRect();
            const breakpoint = determineBreakpoint(rect.width);
            setBreakpoint(breakpoint);
        });
    }, []);
    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);
    useIsomorphicLayoutEffect(() => {
        if (!node) {
            return;
        }
        const resizeObserver = new ResizeObserver(resizeCallback);
        resizeObserver.observe(node);
        return () => {
            resizeObserver.disconnect();
        };
    }, [node]);
    return [ref, breakpoint];
};
