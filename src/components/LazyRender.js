'use client';
import * as React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
export const LazyRender = ({ attrs, children, testId }) => {
    const [visible, setVisible] = React.useState(false);
    const containerAttrs = testId ? Object.assign(Object.assign({}, attrs), { 'data-testid': testId }) : attrs;
    const handleVisibilityChanged = (params) => {
        if (params.isVisible) {
            setVisible(true);
        }
    };
    const containerRef = useIntersectionObserver({
        once: true,
        onVisibilityChanged: handleVisibilityChanged,
    });
    return (React.createElement("div", Object.assign({ ref: containerRef }, containerAttrs), visible && children));
};
