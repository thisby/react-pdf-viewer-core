'use client';
import * as React from 'react';
import styles from '../styles/skeleton.module.css';
export const Skeleton = ({ children }) => {
    const [node, setNode] = React.useState(null);
    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);
    React.useEffect(() => {
        if (!node) {
            return;
        }
        const animation = node.animate([
            {
                offset: 0,
                opacity: 1,
            },
            {
                offset: 0.5,
                opacity: 0.5,
            },
            {
                offset: 1,
                opacity: 1,
            },
        ], {
            duration: 2 * 1000,
            easing: 'ease-in-out',
            iterations: Number.MAX_VALUE,
        });
        return () => {
            animation.cancel();
        };
    }, [node]);
    return children({
        attributes: {
            className: styles.skeleton,
        },
        ref,
    });
};
