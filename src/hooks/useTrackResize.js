'use client';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
export const useTrackResize = ({ targetRef, onResize }) => {
    useIsomorphicLayoutEffect(() => {
        const io = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                onResize(entry.target);
            });
        });
        const container = targetRef.current;
        if (!container) {
            return;
        }
        io.observe(container);
        return () => {
            io.unobserve(container);
        };
    }, []);
};
