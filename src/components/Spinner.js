'use client';
import * as React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/spinner.module.css';
import { classNames } from '../utils/classNames';
export const Spinner = ({ size = '4rem', testId }) => {
    const [visible, setVisible] = React.useState(false);
    const attrs = testId ? { 'data-testid': testId } : {};
    const handleVisibilityChanged = (params) => {
        setVisible(params.isVisible);
    };
    const containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });
    return (React.createElement("div", Object.assign({}, attrs, { className: classNames({
            [styles.spinner]: true,
            [styles.spinnerAnimation]: visible,
        }), ref: containerRef, style: { height: size, width: size } })));
};
