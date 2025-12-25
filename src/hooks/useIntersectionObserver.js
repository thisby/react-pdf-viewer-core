'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
export const useIntersectionObserver = (props) => {
    const containerRef = React.useRef(null);
    const { once, threshold, onVisibilityChanged } = props;
    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const intersectionTracker = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;
                const ratio = entry.intersectionRatio;
                onVisibilityChanged({ isVisible, ratio });
                if (isVisible && once) {
                    intersectionTracker.unobserve(container);
                    intersectionTracker.disconnect();
                }
            });
        }, {
            threshold: threshold || 0,
        });
        intersectionTracker.observe(container);
        return () => {
            intersectionTracker.unobserve(container);
            intersectionTracker.disconnect();
        };
    }, []);
    return containerRef;
};
